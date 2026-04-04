import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import Apartment from "@/models/Apartment";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const currentDate = new Date();

    // Find all apartments with expired memberships that are still active
    const expiredApartments = await Apartment.find({
      memberShipExpiry: { $lt: currentDate },
      status: { $ne: "Deactivated" },
    });

    if (expiredApartments.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No expired memberships found",
          count: 0,
        },
        { status: 200 }
      );
    }

    // Deactivate all expired apartments
    const updateResult = await Apartment.updateMany(
      {
        memberShipExpiry: { $lt: currentDate },
        status: { $ne: "Deactivated" },
      },
      {
        $set: {
          status: "Deactivated",
          deactivatedAt: currentDate,
          deactivationReason: "Membership expired",
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: `Successfully deactivated ${updateResult.modifiedCount} expired apartments`,
        count: updateResult.modifiedCount,
        apartments: expiredApartments.map((apt) => ({
          id: apt._id,
          name: apt.apartmentName,
          expiryDate: apt.memberShipExpiry,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error checking expired memberships:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check expired memberships",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Same as GET, but can be called via POST for cron jobs
  return GET(req);
}
