import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import Apartment from "@/models/Apartment";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { apartmentID, duration, paymentID, amount } = await req.json();

    if (!apartmentID || !duration || !paymentID || !amount) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Find the apartment
    const apartment = await Apartment.findById(apartmentID);

    if (!apartment) {
      return NextResponse.json(
        {
          success: false,
          message: "Apartment not found",
        },
        { status: 404 }
      );
    }

    // Calculate new expiry date
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(expiryDate.getMonth() + duration);

    // Reactivate apartment with new membership
    apartment.status = "Available For Rent";
    apartment.paymentStatus = "Verified";
    apartment.txnID = paymentID;
    apartment.paymentDate = currentDate;
    apartment.paymentAmount = amount;
    apartment.memberShipExpiry = expiryDate;
    apartment.membershipDuration = duration;
    apartment.deactivatedAt = undefined;
    apartment.deactivationReason = undefined;

    await apartment.save();

    return NextResponse.json(
      {
        success: true,
        message: "Apartment reactivated successfully",
        data: {
          apartmentID,
          expiryDate,
          status: apartment.status,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error reactivating apartment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to reactivate apartment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
