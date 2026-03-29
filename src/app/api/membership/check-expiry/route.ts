import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import Apartment from "@/models/Apartment";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userID");

    if (!userID) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Get user's apartments
    const apartments = await Apartment.find({ ownerID: userID });

    const notifications = [];
    const currentDate = new Date();

    for (const apartment of apartments) {
      if (apartment.memberShipExpiry) {
        const expiryDate = new Date(apartment.memberShipExpiry);
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Check if expiring in 2 days or less
        if (daysUntilExpiry <= 2 && daysUntilExpiry >= 0) {
          notifications.push({
            type: "membership_expiring",
            apartmentID: apartment._id,
            apartmentName: apartment.apartmentName,
            daysRemaining: daysUntilExpiry,
            expiryDate: apartment.memberShipExpiry,
            message: `Your membership for "${apartment.apartmentName}" expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""}`,
            priority: "high",
          });
        }

        // Check if already expired
        if (daysUntilExpiry < 0) {
          // Disable apartment if expired
          if (apartment.status === "Available For Rent") {
            apartment.status = "Not Available For Rent";
            await apartment.save();
          }

          notifications.push({
            type: "membership_expired",
            apartmentID: apartment._id,
            apartmentName: apartment.apartmentName,
            expiryDate: apartment.memberShipExpiry,
            message: `Your membership for "${apartment.apartmentName}" has expired. Renew to make it visible again.`,
            priority: "urgent",
          });
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: notifications,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error checking membership expiry:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check membership expiry",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
