import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import Apartment from "@/models/Apartment";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwtSecret";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    // Verify admin authentication
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, getJwtSecret(), {
        algorithms: ["HS256"],
      });
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token", success: false },
        { status: 401 }
      );
    }

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Access denied. Admin only.", success: false },
        { status: 403 }
      );
    }

    // Get statistics
    const totalUsers = await User.countDocuments();
    const totalOwners = await User.countDocuments({ role: "OWNER" });
    const totalRenters = await User.countDocuments({ role: "RENTER" });
    
    const totalApartments = await Apartment.countDocuments();
    const activeApartments = await Apartment.countDocuments({
      memberShipExpiry: { $gte: new Date() },
    });
    const expiredApartments = await Apartment.countDocuments({
      memberShipExpiry: { $lt: new Date() },
    });

    // Apartments expiring in next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const expiringIn7Days = await Apartment.countDocuments({
      memberShipExpiry: {
        $gte: new Date(),
        $lte: sevenDaysFromNow,
      },
    });

    // Pending withdrawals
    const pendingWithdrawals = await User.countDocuments({
      "withdrawalHistory.status": "PENDING",
    });

    // Calculate total withdrawal amount
    const usersWithPendingWithdrawals = await User.find({
      "withdrawalHistory.status": "PENDING",
    });
    
    let totalWithdrawalAmount = 0;
    usersWithPendingWithdrawals.forEach((user) => {
      user.withdrawalHistory?.forEach((req: any) => {
        if (req.status === "PENDING") {
          totalWithdrawalAmount += req.amount || 0;
        }
      });
    });

    // New apartments today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const newApartmentsToday = await Apartment.countDocuments({
      createdAt: { $gte: todayStart },
    });

    const stats = {
      totalUsers,
      totalOwners,
      totalRenters,
      totalApartments,
      activeApartments,
      expiredApartments,
      expiringIn7Days,
      pendingWithdrawals,
      totalWithdrawalAmount,
      newApartmentsToday,
    };

    return NextResponse.json(
      {
        message: "Stats fetched successfully",
        success: true,
        data: stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
