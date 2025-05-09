import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  try {
    await connectMongoDB();
    const users = await User.findById(id);
    return NextResponse.json(
      {
        success: true,
        data: users,
        message: "User fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
