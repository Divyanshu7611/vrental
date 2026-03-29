import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const POINTS_PER_REFERRAL = 10; // Points earned per successful referral

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { referralCode } = await req.json();
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
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user already has a referrer
    if (currentUser.referredBy) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already used a referral code",
        },
        { status: 400 }
      );
    }

    // Check if referral code is provided
    if (!referralCode || referralCode.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Referral code is required" },
        { status: 400 }
      );
    }

    // Find the referrer by referral code
    const referrer = await User.findOne({
      referralCode: referralCode.toUpperCase(),
    });

    if (!referrer) {
      return NextResponse.json(
        { success: false, message: "Invalid referral code" },
        { status: 404 }
      );
    }

    // Check if user is trying to use their own referral code
    if (referrer._id.toString() === currentUser._id.toString()) {
      return NextResponse.json(
        { success: false, message: "You cannot use your own referral code" },
        { status: 400 }
      );
    }

    // Check if referrer is an OWNER
    if (referrer.role !== "OWNER") {
      return NextResponse.json(
        {
          success: false,
          message: "Referral code is only valid for property owners",
        },
        { status: 400 }
      );
    }

    // Update current user with referrer info
    currentUser.referredBy = referrer._id.toString();
    await currentUser.save();

    // Add points to referrer
    referrer.referralPoints += POINTS_PER_REFERRAL;
    referrer.referralEarnings += POINTS_PER_REFERRAL; // 1 point = 1 rupee
    referrer.referralHistory.push({
      referredUserId: currentUser._id,
      referredUserName: `${currentUser.firstName} ${currentUser.lastName}`,
      pointsEarned: POINTS_PER_REFERRAL,
      date: new Date(),
    });
    await referrer.save();

    return NextResponse.json(
      {
        success: true,
        message: `Referral code applied successfully! ${referrer.firstName} earned ${POINTS_PER_REFERRAL} points.`,
        data: {
          referrerName: `${referrer.firstName} ${referrer.lastName}`,
          pointsEarned: POINTS_PER_REFERRAL,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error applying referral code:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
