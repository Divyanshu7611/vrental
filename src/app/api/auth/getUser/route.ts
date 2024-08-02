import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";

export async function GET(req: NextRequest) {
  try {
    await ConnectMongoDB();
    const users = await User.find({});
    return Response.json({ users });
    await DisconnectMongoDB();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
