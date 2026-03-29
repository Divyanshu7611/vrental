import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import Apartment from "@/models/Apartment";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const currentDate = new Date();

    // Get statistics
    const totalApartments = await Apartment.countDocuments();
    const activeApartments = await Apartment.countDocuments({
      status: "Available For Rent",
      paymentStatus: "Verified",
    });
    const deactivatedApartments = await Apartment.countDocuments({
      status: "Deactivated",
    });

    // Get apartments expiring in next 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringSoon = await Apartment.find({
      memberShipExpiry: {
        $gte: currentDate,
        $lte: sevenDaysFromNow,
      },
      status: { $ne: "Deactivated" },
    })
      .select("apartmentName memberShipExpiry ownerID")
      .populate("ownerID", "name email")
      .limit(10);

    // Get recently expired apartments
    const recentlyExpired = await Apartment.find({
      memberShipExpiry: { $lt: currentDate },
      status: { $ne: "Deactivated" },
    })
      .select("apartmentName memberShipExpiry ownerID")
      .populate("ownerID", "name email")
      .limit(10);

    // Get deactivated apartments
    const deactivatedList = await Apartment.find({
      status: "Deactivated",
    })
      .select("apartmentName deactivatedAt deactivationReason memberShipExpiry ownerID")
      .populate("ownerID", "name email")
      .sort({ deactivatedAt: -1 })
      .limit(10);

    return NextResponse.json(
      {
        success: true,
        data: {
          statistics: {
            total: totalApartments,
            active: activeApartments,
            deactivated: deactivatedApartments,
            expiringSoon: expiringSoon.length,
            needsDeactivation: recentlyExpired.length,
          },
          expiringSoon: expiringSoon.map((apt: any) => ({
            id: apt._id,
            name: apt.apartmentName,
            expiryDate: apt.memberShipExpiry,
            daysRemaining: Math.ceil(
              (new Date(apt.memberShipExpiry).getTime() - currentDate.getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            owner: {
              name: apt.ownerID?.name,
              email: apt.ownerID?.email,
            },
          })),
          recentlyExpired: recentlyExpired.map((apt: any) => ({
            id: apt._id,
            name: apt.apartmentName,
            expiryDate: apt.memberShipExpiry,
            daysExpired: Math.ceil(
              (currentDate.getTime() - new Date(apt.memberShipExpiry).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            owner: {
              name: apt.ownerID?.name,
              email: apt.ownerID?.email,
            },
          })),
          deactivated: deactivatedList.map((apt: any) => ({
            id: apt._id,
            name: apt.apartmentName,
            deactivatedAt: apt.deactivatedAt,
            reason: apt.deactivationReason,
            expiryDate: apt.memberShipExpiry,
            owner: {
              name: apt.ownerID?.name,
              email: apt.ownerID?.email,
            },
          })),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching membership status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch membership status",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
