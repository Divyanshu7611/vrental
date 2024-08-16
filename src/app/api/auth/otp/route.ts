import OTP from "@/models/OTP";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import otpGenerator from "otp-generator";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  try {
    await connectMongoDB();
    // checkk user already exist or not
    const existUser = await OTP.findOne({ email });
    if (existUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already Exist",
        },
        { status: 403 }
      );
    }
    var otp = otpGenerator.generate(6, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    console.log("OTP IS :", otp);
    // check unique otp or not
    let uniqueOTP = await OTP.findOne({ otp: otp });
    while (uniqueOTP) {
      otp = otpGenerator.generate(6, {
        specialChars: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
      });
      uniqueOTP = await OTP.findOne({ otp: otp });
    }

    // create otp payload
    const otpPayload = { email, otp };
    //    create otp entry into db
    const otpBody = await OTP.create(otpPayload);
    // return respooonse
    return NextResponse.json(
      {
        success: true,
        message: "OTP Send Successfuly",
        otp: otp,
      },
      { status: 200 }
    );
    // await DisconnectMongoDB();
  } catch (error) {
    // await DisconnectMongoDB();
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
