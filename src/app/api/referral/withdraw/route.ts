import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const MINIMUM_WITHDRAWAL_POINTS = 100;

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { points, paymentMethod, upiId, bankDetails } = await req.json();
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
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is an OWNER
    if (user.role !== "OWNER") {
      return NextResponse.json(
        {
          success: false,
          message: "Only property owners can withdraw referral earnings",
        },
        { status: 403 }
      );
    }

    // Validate payment method
    if (!paymentMethod || (paymentMethod !== "UPI" && paymentMethod !== "BANK")) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid payment method (UPI or BANK)",
        },
        { status: 400 }
      );
    }

    // Validate payment details
    if (paymentMethod === "UPI" && !upiId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide UPI ID",
        },
        { status: 400 }
      );
    }

    if (paymentMethod === "BANK") {
      if (!bankDetails || !bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
        return NextResponse.json(
          {
            success: false,
            message: "Please provide complete bank details (Account Number, IFSC Code, Account Holder Name)",
          },
          { status: 400 }
        );
      }
    }

    // Validate points
    if (!points || points < MINIMUM_WITHDRAWAL_POINTS) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum withdrawal is ${MINIMUM_WITHDRAWAL_POINTS} points (₹${MINIMUM_WITHDRAWAL_POINTS})`,
        },
        { status: 400 }
      );
    }

    // Check if user has enough points
    if (user.referralPoints < points) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient points. You have ${user.referralPoints} points available.`,
        },
        { status: 400 }
      );
    }

    // Check for pending withdrawals
    const hasPendingWithdrawal = user.withdrawalHistory.some(
      (w: any) => w.status === "PENDING"
    );

    if (hasPendingWithdrawal) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have a pending withdrawal request",
        },
        { status: 400 }
      );
    }

    // Deduct points
    user.referralPoints -= points;

    // Prepare withdrawal data
    const withdrawalData: any = {
      amount: points, // 1 point = 1 rupee
      pointsDeducted: points,
      status: "PENDING",
      requestDate: new Date(),
      paymentMethod,
    };

    // Add payment details based on method
    if (paymentMethod === "UPI") {
      withdrawalData.upiId = upiId;
      console.log("Saving UPI withdrawal:", { upiId, paymentMethod });
    } else if (paymentMethod === "BANK") {
      withdrawalData.bankDetails = {
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
        accountHolderName: bankDetails.accountHolderName,
        bankName: bankDetails.bankName || "",
      };
      console.log("Saving BANK withdrawal:", withdrawalData.bankDetails);
    }

    console.log("Final withdrawal data before save:", withdrawalData);

    // Add withdrawal request
    user.withdrawalHistory.push(withdrawalData);

    await user.save();

    console.log("Withdrawal saved successfully!");

    return NextResponse.json(
      {
        success: true,
        message: `Withdrawal request for ₹${points} submitted successfully! It will be processed within 3-5 business days.`,
        data: {
          amount: points,
          remainingPoints: user.referralPoints,
          status: "PENDING",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// GET - Get all withdrawal requests (for admin)
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

    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "Divyanshu", {
      algorithms: ["HS256"]
    });
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is ADMIN
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    // Get all users with pending withdrawals
    const usersWithWithdrawals = await User.find({
      "withdrawalHistory.status": "PENDING",
    }).select("firstName lastName email phone withdrawalHistory referralPoints");

    const pendingWithdrawals = usersWithWithdrawals.flatMap((user) =>
      user.withdrawalHistory
        .filter((w: any) => w.status === "PENDING")
        .map((w: any) => ({
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          amount: w.amount,
          pointsDeducted: w.pointsDeducted,
          requestDate: w.requestDate,
          withdrawalId: w._id,
        }))
    );

    return NextResponse.json(
      {
        success: true,
        data: pendingWithdrawals,
        total: pendingWithdrawals.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
