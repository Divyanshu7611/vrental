import Apartment from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const apartmentID = url.searchParams.get("id");

  try {
    await connectMongoDB();

    if (!apartmentID) {
      return NextResponse.json(
        {
          success: false,
          message: "ApartmentID is required",
        },
        { status: 400 }
      );
    }

    // Parse the request body to get the new status
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required",
        },
        { status: 400 }
      );
    }

    // Update the apartment's status
    const updatedApartment = await Apartment.findByIdAndUpdate(
      apartmentID,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedApartment) {
      return NextResponse.json(
        {
          success: false,
          message: "Apartment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Apartment status updated successfully",
        apartment: updatedApartment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating apartment status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
