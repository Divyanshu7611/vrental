import Apartment from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import { sortApartmentsForPublicList } from "@/utilis/apartmentListSort";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  try {
    await connectMongoDB();
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required",
        },
        { status: 400 }
      );
    }
    const apartments = await Apartment.find({
      category: category,
      paymentStatus: "Verified",
      status: { $ne: "Deactivated" }, // Exclude deactivated apartments
    }).lean();

    const sorted = sortApartmentsForPublicList(
      apartments as {
        categoryFeaturedOrder?: number;
        averageRating?: number;
        _id?: string;
      }[]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Verified Apartments Fetched Successfully",
        data: sorted,
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
