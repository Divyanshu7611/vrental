import { NextRequest,NextResponse } from "next/server";
import User from "@/models/User";
import { connectMongoDB } from "@/utilis/dbConnect";
import admin from "@/utilis/firebaseAdmin";
import { nanoid } from "nanoid";
import { ClientRequest } from "http";
import { Phone } from "lucide-react";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

async function generateVrentalId(){
    let clientId;
    let existingUser;

    do{
        clientId = nanoid(10);
        existingUser = await User.findOne({clientId});
    }while(existingUser);
    return clientId
}


export async function POST(request: NextRequest){
    const {token,displayName,email,photoUrl,phoneNumber,role} = await request.json();
    try {
        await connectMongoDB()

        if (!email || typeof email !== "string" || !email.trim()) {
          return NextResponse.json(
            { success: false, message: "Email is required" },
            { status: 400 }
          );
        }

        // const decodedToken = await admin.auth().verifyIdToken(token);
        // const {uid,email,name,picture,phone_number} = decodedToken;

        // password pending
        const rawEmail = typeof email === "string" ? email.trim() : "";
        const emailNorm = rawEmail ? rawEmail.toUpperCase() : "";

        let user = emailNorm
          ? await User.findOne({ email: emailNorm })
          : null;
        if (!user && rawEmail) {
          user = await User.findOne({ email: rawEmail });
        }

            let isNewUser = false;

            if(!user){
                isNewUser = true;
                const [firstName, ...lastNameArr] = displayName.split(' ');
                const lastName = lastNameArr.join(' ') || '';
                const clientID = await generateVrentalId();
                
                // Generate referral code for new user
                const referralCode = nanoid(8).toUpperCase();
                
                user = await User.create({
                    email: emailNorm,
                    firstName,
                    lastName,
                    image: photoUrl || `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=418FA9`,
                    adharNo: "",
                    role: role || "USER",
                    termsAndConditions: true,
                    emailVerified: true,
                    clientID,
                    profession: "",
                    age: "",
                    bio: "",
                    phone: phoneNumber || 9445555555,
                    password: "dsedsmcsd\cdewcew\\cewce\c\e\w\c\\ecew",
                    referralCode: referralCode,
                    referralPoints: 0,
                    referralEarnings: 0,
                    referralHistory: [],
                    withdrawalHistory: [],
                })
            } else {
                if (emailNorm && user.email !== emailNorm) {
                    user.email = emailNorm;
                }
                // Existing user - check if they need referral code migration
                if (!user.referralCode) {
                    user.referralCode = nanoid(8).toUpperCase();
                }
                if (user.referralPoints === undefined) {
                    user.referralPoints = 0;
                }
                if (user.referralEarnings === undefined) {
                    user.referralEarnings = 0;
                }
                if (!user.referralHistory) {
                    user.referralHistory = [];
                }
                if (!user.withdrawalHistory) {
                    user.withdrawalHistory = [];
                }
                if (user.emailVerified !== true) {
                    user.emailVerified = true;
                }

                // Update role if provided and different
                if (role && user.role !== role) {
                    user.role = role;
                }
                
                await user.save();
            }

            // Generate JWT token (same as regular login)
            const JwtKey = process.env.JWT_SECRET || "Divyanshu";
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,
            };

            const token = jwt.sign(payload, JwtKey, {
                expiresIn: "7d", // Longer expiry for Google login
                algorithm: "HS256"
            });

            // Update user token
            user.token = token;
            await user.save();

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            return NextResponse.json(
                { 
                    success: true, 
                    message: "User authenticated successfully", 
                    data: userResponse,
                    token: token,
                    isNewUser 
                },
                { status: 200 }
              );
        
    } catch (error) {
    console.error("Firebase Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid authentication" },
      { status: 401 }
    );  
    }
}