import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import { comparePassword } from "@/utilis/passwordHash";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(NextRequest: NextRequest) {
  const { email, password } = await NextRequest.json();

  const JwtKey = process.env.JWT_SECRET || "Divyanshu";

  try {
    await connectMongoDB();

    const emailNorm =
      typeof email === "string" ? email.trim().toUpperCase() : "";

    const existingUser = await User.findOne({ email: emailNorm });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User Not Found, Please sign up",
        },
        { status: 404 }
      );
    }

    if (existingUser.emailVerified === false) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email before logging in. Sign up again to receive a new OTP.",
        },
        { status: 403 }
      );
    }

    // Compare password and generate token
    if (await comparePassword(password, existingUser.password)) {
      const payload = {
        email: existingUser.email,
        id: existingUser._id,
        role: existingUser.role, // Include role in JWT payload
      };

      const token = jwt.sign(payload, JwtKey, {
        expiresIn: "7d", // Extended expiry
        algorithm: "HS256" // Explicit algorithm
      });

      existingUser.token = token;
      await existingUser.save(); // Save token to database

      // Remove password from response
      const userResponse = existingUser.toObject();
      delete userResponse.password;

      const option = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
      };

      return NextResponse.json(
        {
          success: true,
          message: "Logged In Successfully",
          existingUser: userResponse,
          cookie: "token",
          token,
          option,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Password Incorrect",
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
