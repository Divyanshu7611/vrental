import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";
import { NextResponse } from "next/server";
import User from "@/models/User";
import Event from "@/models/Event"; // Make sure this import path is correct

export async function GET(req: Request) {
  try {
    await ConnectMongoDB();
    const url = new URL(req.url);
    const tharID = url.searchParams.get("tharID");
    console.log("user Id is", tharID);

    // Fetch user details along with participated events
    const users = await User.findOne({ tharID }).populate({
      path: "participated",
      model: Event,
    });

    if (!users) {
      return NextResponse.json(
        {
          success: false,
          message: "No users found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Users and Participated Events Retrieved Successfully",
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users and events:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  } finally {
    await DisconnectMongoDB();
  }
}
