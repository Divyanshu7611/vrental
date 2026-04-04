import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { referralCode } = await req.json();

    if (!referralCode || referralCode.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Referral code is required",
        },
        { status: 400 }
      );
    }

    // Find user with this referral code
    const referrer = await User.findOne({
      referralCode: referralCode.toUpperCase(),
    }).select("firstName lastName email referralCode role");

    if (!referrer) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid referral code. Please check and try again.",
        },
        { status: 404 }
      );
    }

    // Check if referrer is an OWNER
    if (referrer.role !== "OWNER") {
      return NextResponse.json(
        {
          success: false,
          message: "This referral code is not valid for property listings.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Referral code verified successfully!",
        data: {
          referrerName: `${referrer.firstName} ${referrer.lastName}`,
          referralCode: referrer.referralCode,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying referral code:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify referral code",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
