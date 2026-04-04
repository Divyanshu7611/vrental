import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import Apartment from "@/models/Apartment";
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

    // Get apartments expiring in next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringApartments = await Apartment.find({
      memberShipExpiry: {
        $gte: new Date(),
        $lte: sevenDaysFromNow,
      },
    })
      .populate("ownerID", "firstName lastName email phoneNumber")
      .sort({ memberShipExpiry: 1 })
      .lean();

    return NextResponse.json(
      {
        message: "Expiring apartments fetched successfully",
        success: true,
        data: expiringApartments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching expiring apartments:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
