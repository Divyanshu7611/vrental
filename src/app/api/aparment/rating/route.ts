import mongoose from "mongoose";
import Apartment, { IApartment } from "@/models/Apartment";
import { connectMongoDB } from "@/utilis/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const apartmentID = url.searchParams.get("id");

  if (!apartmentID || !mongoose.Types.ObjectId.isValid(apartmentID)) {
    return NextResponse.json(
      { success: false, message: "Valid apartment id is required" },
      { status: 400 }
    );
  }

  try {
    await connectMongoDB();
    const body = await req.json();
    const userRaw = body?.user;
    const rating = Number(body?.rating);

    if (!userRaw || !Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Valid user and rating (1–5) are required" },
        { status: 400 }
      );
    }

    const userIdStr = String(userRaw).trim();
    if (!mongoose.Types.ObjectId.isValid(userIdStr)) {
      return NextResponse.json(
        { success: false, message: "Invalid user id" },
        { status: 400 }
      );
    }
    const userObjectId = new mongoose.Types.ObjectId(userIdStr);

    const apartment = (await Apartment.findById(apartmentID)) as IApartment | null;

    if (!apartment) {
      return NextResponse.json(
        { success: false, message: "Apartment not found" },
        { status: 404 }
      );
    }

    if (apartment.status === "Draft" || apartment.paymentStatus !== "Verified") {
      return NextResponse.json(
        { success: false, message: "This listing cannot be rated yet" },
        { status: 400 }
      );
    }

    if (apartment.ownerID.toString() === userIdStr) {
      return NextResponse.json(
        { success: false, message: "You cannot rate your own listing" },
        { status: 403 }
      );
    }

    const existingRating = apartment.ratings.find(
      (r) => String(r.user) === userIdStr
    );

    if (existingRating) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already rated this apartment",
        },
        { status: 409 }
      );
    }

    apartment.ratings.push({ user: userObjectId, rating });

    await apartment.save();

    return NextResponse.json(
      { success: true, data: { averageRating: apartment.averageRating } },
      { status: 200 }
    );
  } catch (error) {
    console.error("rating POST:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const apartmentID = url.searchParams.get("id");
  try {
    await connectMongoDB();

    if (!apartmentID || !mongoose.Types.ObjectId.isValid(apartmentID)) {
      return NextResponse.json(
        { success: false, message: "Valid apartment id is required" },
        { status: 400 }
      );
    }

    const findAppartment = await Apartment.findById(apartmentID);

    return NextResponse.json(
      { success: true, data: findAppartment?.averageRating ?? 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
