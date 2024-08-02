import Apartment from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  try {
    await ConnectMongoDB();
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required",
        },
        { status: 400 }
      );
    }
    const apartments = await Apartment.find({ category: category });
    await DisconnectMongoDB();
    return NextResponse.json(
      {
        success: true,
        message: "All Apartments Fetched Properly",
        data: apartments,
      },
      { status: 200 }
    );
  } catch (error) {
    await DisconnectMongoDB();

    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
