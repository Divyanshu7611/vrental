import Apartment from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userID = url.searchParams.get("id");
  const apartmentID = url.searchParams.get("apartmentID");

  try {
    await ConnectMongoDB();

    if (!userID && !apartmentID) {
      return NextResponse.json(
        {
          success: false,
          message: "ID or ApartmentID is required",
        },
        { status: 400 }
      );
    }

    let apartments;
    if (apartmentID) {
      apartments = await Apartment.findById(apartmentID).exec();
      if (!apartments) {
        return NextResponse.json(
          {
            success: false,
            message: "Apartment not found",
          },
          { status: 404 }
        );
      }
    } else {
      apartments = await Apartment.find({ ownerID: userID }).exec();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Apartments fetched properly",
        data: apartments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching apartments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await DisconnectMongoDB();
  }
}
