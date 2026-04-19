import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/utilis/passwordHash";
import { nanoid } from "nanoid";
import OTP from "@/models/OTP";
import mailerSender from "@/utilis/mailSender";
import registrationSuccess from "@/mail/templates/registrationSuccess";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwtSecret";

export const dynamic = "force-dynamic";

async function generatingTharID() {
  let clientID;
  let existingUser;
  do {
    clientID = nanoid(6);
    existingUser = await User.findOne({ clientID });
  } while (existingUser);
  return clientID;
}

async function sendMail(email: string, clientID: string, firstName: string) {
  try {
    await mailerSender({
      email,
      title: "Registration Successful",
      body: registrationSuccess(clientID, firstName),
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error Occurred While Sending Email" };
  }
}

export async function POST(request: NextRequest) {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    otp,
    profession,
    age,
    bio,
    role,
  } = await request.json();

  try {
    await connectMongoDB();

    const emailNorm =
      typeof email === "string" ? email.trim().toUpperCase() : "";

    // // Input validation
    if (
      !firstName ||
      !lastName ||
      !emailNorm ||
      !password ||
      !phone ||
      !otp
    ) {
      return NextResponse.json(
        { success: false, message: "Please fill all details" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: emailNorm });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User Already Exists" },
        { status: 400 }
      );
    }



    // Hash password
    const hashedPassword = await hashPassword(password, 10);

    // Generate unique client ID
    const clientID = await generatingTharID();

    const otpCode = String(otp).trim();
    const recentOtp = await OTP.findOne({ email: emailNorm })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!recentOtp || otpCode !== recentOtp.otp) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP. Request a new code." },
        { status: 403 }
      );
    }

    // Generate referral code for new user
    const referralCode = nanoid(8).toUpperCase();

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email: emailNorm,
      password: hashedPassword,
      phone,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=418FA9`,
      clientID,
      adharNo: "",
      role: role || "USER",
      termsAndConditions: true,
      emailVerified: true,
      profession: profession || "",
      age: age || "",
      bio: bio || "",
      referralCode: referralCode,
      referralPoints: 0,
      referralEarnings: 0,
      referralHistory: [],
      withdrawalHistory: [],
    });

    await OTP.deleteMany({ email: emailNorm });

    // Generate JWT token
    const JwtKey = getJwtSecret();
    const payload = {
      email: newUser.email,
      id: String(newUser._id),
      role: newUser.role,
    };

    const token = jwt.sign(payload, JwtKey, {
      expiresIn: "7d",
      algorithm: "HS256"
    });

    // Update user with token
    newUser.token = token;
    await newUser.save();

    // Welcome email (non-blocking — account is already created and verified)
    void sendMail(emailNorm, clientID, firstName).catch((err) =>
      console.error("Registration welcome email failed:", err)
    );

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json(
      { 
        success: true, 
        message: "User Entry Created Successfully",
        token: token,
        data: userResponse
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
