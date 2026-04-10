import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

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

    if (referrer.role !== "OWNER" && referrer.role !== "USER") {
      return NextResponse.json(
        {
          success: false,
          message: "This referral code is not valid",
        },
        { status: 400 }
      );
    }

    // Link referrer only; reward points are credited on apartment listing (see createEvent), not on signup.
    currentUser.referredBy = referrer._id.toString();
    await currentUser.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Referral code applied successfully. Referral reward points are earned only when an owner publishes an apartment listing using this code.",
        data: {
          referrerName: `${referrer.firstName} ${referrer.lastName}`,
          pointsEarned: 0,
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
