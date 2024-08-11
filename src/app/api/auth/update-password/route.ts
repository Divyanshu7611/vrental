import User from "@/models/User";
import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";
import bcrypt from "bcrypt";
import { Underdog } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { newPassword, resetToken } = await request.json();
  try {
    await ConnectMongoDB();
    // validatte
    if (!newPassword || !resetToken) {
      return NextResponse.json(
        {
          success: false,
          message: "All Fields Are Required",
        },
        { status: 403 }
      );
    }

    // find user on the basis if token
    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Token Or Token Expired",
        },
        { status: 402 }
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
    await DisconnectMongoDB();

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
      },
      { status: 500 }
    );
  }
}
