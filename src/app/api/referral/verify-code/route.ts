import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

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

    const normalized = referralCode.toUpperCase().trim();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "Divyanshu", {
          algorithms: ["HS256"],
        });
        const self = await User.findById(decoded.id).select("referralCode");
        if (self?.referralCode && self.referralCode === normalized) {
          return NextResponse.json(
            {
              success: false,
              message: "You cannot use your own referral code",
            },
            { status: 400 }
          );
        }
      } catch {
        /* ignore invalid token for public verify */
      }
    }

    const referrer = await User.findOne({
      referralCode: normalized,
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

    if (referrer.role !== "OWNER" && referrer.role !== "USER") {
      return NextResponse.json(
        {
          success: false,
          message: "This referral code cannot be used here.",
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
          referrerRole: referrer.role,
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
