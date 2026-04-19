
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwtSecret";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { userId, withdrawalId, status, transactionId } = await req.json();
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded: any = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"]
    });
    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    // Validate input
    if (!userId || !withdrawalId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["COMPLETED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // Find user and withdrawal
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const withdrawal = user.withdrawalHistory.id(withdrawalId);

    if (!withdrawal) {
      return NextResponse.json(
        { success: false, message: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json(
        { success: false, message: "Withdrawal request already processed" },
        { status: 400 }
      );
    }

    // Update withdrawal status
    withdrawal.status = status;
    withdrawal.completedDate = new Date();
    if (transactionId) {
      withdrawal.transactionId = transactionId;
    }

    // If rejected, refund points
    if (status === "REJECTED") {
      user.referralPoints += withdrawal.pointsDeducted;
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: `Withdrawal request ${status.toLowerCase()} successfully`,
        data: {
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          amount: withdrawal.amount,
          status: withdrawal.status,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating withdrawal:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
