import Apartment from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userID = url.searchParams.get("id");
  const apartmentID = url.searchParams.get("apartmentID");

  try {
    await connectMongoDB();

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
      const list = await Apartment.find({ ownerID: userID }).exec();
      // Drafts awaiting payment first so owners see "continue payment" listings at the top of My Apartments.
      const rank = (a: (typeof list)[number]) => {
        if (a.status === "Draft" && a.paymentStatus === "Pending") return 0;
        if (a.status === "Draft") return 1;
        return 2;
      };
      apartments = [...list].sort((a, b) => {
        const d = rank(a) - rank(b);
        if (d !== 0) return d;
        return String(b._id).localeCompare(String(a._id));
      });
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
  }
}
