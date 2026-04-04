import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
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

    const { withdrawalId } = await req.json();

    if (!withdrawalId) {
      return NextResponse.json(
        { message: "Withdrawal ID is required", success: false },
        { status: 400 }
      );
    }

    // Find user with this withdrawal request
    const user = await User.findOne({
      "withdrawalHistory._id": withdrawalId,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Withdrawal request not found", success: false },
        { status: 404 }
      );
    }

    // Get withdrawal details
    const withdrawalIndex = user.withdrawalHistory?.findIndex(
      (req: any) => req._id.toString() === withdrawalId
    );

    if (withdrawalIndex === -1 || withdrawalIndex === undefined) {
      return NextResponse.json(
        { message: "Withdrawal request not found", success: false },
        { status: 404 }
      );
    }

    const withdrawal = user.withdrawalHistory[withdrawalIndex];

    // Check if already processed
    if (withdrawal.status !== "PENDING") {
      return NextResponse.json(
        { message: "Withdrawal already processed", success: false },
        { status: 400 }
      );
    }

    // Update withdrawal status to COMPLETED
    // Admin will manually transfer money using the payment details shown in dashboard
    user.withdrawalHistory[withdrawalIndex].status = "COMPLETED";
    user.withdrawalHistory[withdrawalIndex].completedDate = new Date();

    await user.save();

    return NextResponse.json(
      {
        message: "Withdrawal approved successfully. Please transfer money manually to the user's account.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving withdrawal:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
