import User from "@/models/User";
import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { phone, profession, age, bio, firstName, lastName } = await req.json();
  try {
    await ConnectMongoDB();
    const url = new URL(req.url);
    const userID = url.searchParams.get("id");
    const existUserId = await User.findById(userID);
    if (!existUserId) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
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
    await DisconnectMongoDB();
    return NextResponse.json(
      {
        message: "Profile Updated Successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    await DisconnectMongoDB();
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
