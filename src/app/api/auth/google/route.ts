import { NextRequest,NextResponse } from "next/server";
import User from "@/models/User";
import { connectMongoDB } from "@/utilis/dbConnect";
import admin from "@/utilis/firebaseAdmin";
import { nanoid } from "nanoid";
import { ClientRequest } from "http";
import { Phone } from "lucide-react";

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
    const {token,displayName,email,photoUrl,phoneNumber} = await request.json();
    try {
        await connectMongoDB()

        // const decodedToken = await admin.auth().verifyIdToken(token);
        // const {uid,email,name,picture,phone_number} = decodedToken;

        // password pending
        let user = await User.findOne({
            email})

            if(!user){
                const [firstName, ...lastNameArr] = displayName.split(' ');
                const lastName = lastNameArr.join(' ') || '';
                const clientID = await generateVrentalId();
                user = await User.create({
                    email,
                    firstName,
                    lastName,
                    image: photoUrl || `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=418FA9`,
                    adharNo: "",
                    role: "USER",
                    termsAndConditions: true,
                    clientID,
                    profession: "",
                    age: "",
                    bio: "",
                    phone: phoneNumber || 9445555555,
                    password: "dsedsmcsd\cdewcew\\cewce\c\e\w\c\\ecew",
                })
            }

            return NextResponse.json(
                { success: true, message: "User authenticated successfully",data:user },
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