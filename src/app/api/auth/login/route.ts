import { Request, Response } from "express";
import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { Cookie } from "next/font/google";

export async function POST(NextRequest: NextRequest) {
  const { email, password } = await NextRequest.json();

  const JwtKey = process.env.JWT_SECRET || "Divyanshu";

  try {
    await ConnectMongoDB();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 401 }
      );
    }

    // Verification
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User Not Found, Please sign up",
        },
        { status: 404 }
      );
    }

    // Compare password and generate token
    if (await bcrypt.compare(password, existingUser.password)) {
      const payload = {
        email: existingUser.email,
        id: existingUser._id,
      };

      const token = jwt.sign(payload, JwtKey, {
        expiresIn: "2h",
      });

      existingUser.token = token;
      existingUser.password = undefined!;

      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      await DisconnectMongoDB();
      return NextResponse.json(
        {
          success: true,
          message: "Logged In Successfully",
          existingUser,
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
