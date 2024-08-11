import User from "@/models/User";
import { nanoid } from "nanoid";
import mailerSender from "@/utilis/mailSender";
import { NextRequest, NextResponse } from "next/server";
import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";
export async function POST(request: NextRequest) {
  const { email } = await request.json();
  try {
    await ConnectMongoDB();
    // validate
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please Provide Your Valid Email",
        },
        { status: 402 }
      );
    }

    // verify user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User Does Not Exist",
        },
        { status: 402 }
      );
    }

    // make unique token
    const token = nanoid(32);
    // upadte token into user database
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      { resetToken: token, resetTokenExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );
    // make url and attach token into it
    const url = `http://vrental.in/update-password?user=${token}`;
    // send token to user mail id
    await mailerSender({
      email: email,
      title: "Reset Password Link",
      body: `Password-Reset-Link:${url}`,
    });
    await DisconnectMongoDB();
    return NextResponse.json(
      {
        success: true,
        message: "Reset token Sent Successsfuly to user",
      },
      { status: 200 }
    );
  } catch (error) {
    await DisconnectMongoDB();
    console.log(error);
    NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
