import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

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
      decoded = jwt.verify(token, process.env.JWT_SECRET || "Divyanshu", {
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

    // Get all withdrawal requests from all users
    const usersWithWithdrawals = await User.find({
      withdrawalHistory: { $exists: true, $ne: [] },
    })
      .select("firstName lastName email phone withdrawalHistory")
      .lean();

    // Flatten withdrawal requests with user info
    const allWithdrawals: any[] = [];
    usersWithWithdrawals.forEach((user) => {
      user.withdrawalHistory?.forEach((withdrawal: any) => {
        allWithdrawals.push({
          _id: withdrawal._id,
          userId: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phone,
          },
          amount: withdrawal.amount,
          points: withdrawal.pointsDeducted,
          status: withdrawal.status,
          paymentMethod: withdrawal.paymentMethod,
          upiId: withdrawal.upiId,
          bankDetails: withdrawal.bankDetails,
          requestedAt: withdrawal.requestDate,
          processedAt: withdrawal.completedDate,
        });
      });
    });

    // Sort by requested date (newest first)
    allWithdrawals.sort(
      (a, b) =>
        new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );

    return NextResponse.json(
      {
        message: "Withdrawal requests fetched successfully",
        success: true,
        data: allWithdrawals,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching withdrawal requests:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
