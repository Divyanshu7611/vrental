import User from "@/models/User";
import { connectMongoDB } from "@/utilis/dbConnect";
import { verifyToken } from "@/utilis/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { phone, profession, age, bio, firstName, lastName } = await req.json();
  try {
    await connectMongoDB();
    const url = new URL(req.url);
    const userID = url.searchParams.get("id");
    const existUserId = await User.findById(userID);
    if (!existUserId) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }
    // Verify the token and get the userId from the token
    const { isValid, userId, response } = await verifyToken(req);

    // Handle invalid token case
    if (!isValid) {
      return response; // Return the appropriate response if the token is invalid
    }

    // Check if userId is defined before proceeding
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token payload", success: false },
        { status: 401 }
      );
    }

    // Check if the userID from the URL matches the userId from the token
    if (userID !== userId) {
      return NextResponse.json(
        { message: "Unauthorized: User mismatch", success: false },
        { status: 403 }
      );
    }
    await User.findByIdAndUpdate(userID, {
      phone,
      profession,
      age,
      bio,
      firstName,
      lastName,
    });
    const updatedUser = await User.findById(userID).lean(); // Use lean() to get a plain JS object

    return NextResponse.json(
      {
        message: "Profile Updated Successfully",
        success: true,
        User: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
