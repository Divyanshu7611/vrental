import Apartment from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const apartmentID = url.searchParams.get("id");
  try {
    await connectMongoDB();
    if (!apartmentID) {
      return NextResponse.json(
        {
          success: false,
          message: "id is required",
        },
        { status: 400 }
      );
    }
    const apartments = await Apartment.findById(apartmentID);

    return NextResponse.json(
      {
        success: true,
        message: "All Apartments Fetched Properly",
        data: apartments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
