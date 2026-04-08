import Apartment from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";

export const dynamic = "force-dynamic";

const MAX_MAP_LISTINGS = 5000;

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Verified listings with map coordinates. Optional city/state narrows by listing address text. */
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const url = new URL(req.url);
    const city = url.searchParams.get("city")?.trim() || "";
    const state = url.searchParams.get("state")?.trim() || "";

    const base: Record<string, unknown> = {
      paymentStatus: "Verified",
      status: { $ne: "Deactivated" },
      "coordinates.latitude": { $exists: true, $ne: null },
      "coordinates.longitude": { $exists: true, $ne: null },
    };

    // Prefer city-only match so "Kota" does not pull all of Rajasthan
    let filter: Record<string, unknown> = base;
    if (city.length >= 2) {
      filter = {
        ...base,
        location: { $regex: escapeRegex(city), $options: "i" },
      };
    } else if (state.length >= 2) {
      filter = {
        ...base,
        location: { $regex: escapeRegex(state), $options: "i" },
      };
    }

    const apartments = await Apartment.find(filter)
      .select(
        "apartmentName location price category image_urls averageRating coordinates"
      )
      .limit(MAX_MAP_LISTINGS)
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Map listings fetched",
        data: apartments,
        scopedByArea: !!(city.length >= 2 || state.length >= 2),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("mapListings:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
