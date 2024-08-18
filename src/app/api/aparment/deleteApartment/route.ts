import Apartment from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";

export async function DELETE(req: NextRequest) {
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

    await Apartment.findByIdAndDelete(apartmentID);

    return NextResponse.json(
      {
        success: true,
        message: "Apartments Deleted Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Deleting apartments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
