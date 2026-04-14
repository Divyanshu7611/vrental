import OTP from "@/models/OTP";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import otpGenerator from "otp-generator";

export const dynamic = "force-dynamic";

function normalizeEmail(email: string) {
  return email.trim().toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawEmail = body?.email;
    if (!rawEmail || typeof rawEmail !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const email = normalizeEmail(rawEmail);

    await connectMongoDB();

    const existingAccount = await User.findOne({ email });
    if (existingAccount) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists. Please log in.",
        },
        { status: 400 }
      );
    }

    // Allow resend: remove any previous pending OTPs for this email
    await OTP.deleteMany({ email });

    let otp = otpGenerator.generate(6, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    let uniqueOTP = await OTP.findOne({ otp });
    while (uniqueOTP) {
      otp = otpGenerator.generate(6, {
        specialChars: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
      });
      uniqueOTP = await OTP.findOne({ otp });
    }

    await OTP.create({ email, otp });

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent to your email. Check your inbox (and spam).",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP route error:", error);
    const message =
      error instanceof Error && error.message.includes("Failed To Send Email")
        ? error.message
        : "Could not send OTP. Please try again later.";
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
