import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Verify token and get current user
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "Divyanshu", {
      algorithms: ["HS256"]
    });
    const user = await User.findById(decoded.id).select(
      "referralCode referralPoints referralEarnings referralHistory withdrawalHistory role"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Calculate total successful referrals
    const totalReferrals = user.referralHistory.length;

    // Calculate pending withdrawals
    const pendingWithdrawals = user.withdrawalHistory.filter(
      (w: any) => w.status === "PENDING"
    );

    // Calculate completed withdrawals
    const completedWithdrawals = user.withdrawalHistory.filter(
      (w: any) => w.status === "COMPLETED"
    );

    const totalWithdrawn = completedWithdrawals.reduce(
      (sum: number, w: any) => sum + w.amount,
      0
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          referralCode: user.referralCode,
          referralPoints: user.referralPoints,
          referralEarnings: user.referralEarnings,
          totalReferrals,
          totalWithdrawn,
          pendingWithdrawals: pendingWithdrawals.length,
          canWithdraw: user.referralPoints >= 100,
          referralHistory: user.referralHistory,
          withdrawalHistory: user.withdrawalHistory,
          isOwner: user.role === "OWNER",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching referral stats:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
