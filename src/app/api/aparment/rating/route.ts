import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Apartment, { IApartment } from "@/models/Apartment";
import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { URL } from "url";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const apartmentID = url.searchParams.get("id");
  try {
    await ConnectMongoDB();
    const { user, rating } = await req.json();

    if (!user || !rating) {
      return NextResponse.json(
        { success: false, message: "User and rating are required" },
        { status: 403 }
      );
    }

    const apartment = (await Apartment.findById(apartmentID)) as IApartment;

    if (!apartment) {
      return NextResponse.json(
        { success: false, message: "Apartment not found" },
        { status: 402 }
      );
    }

    const existingRating = apartment.ratings.find(
      (r) => r.user.toString() === user
    );

    if (existingRating) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already rated this apartment",
        },
        { status: 409 } // Conflict status code
      );
    }
    apartment.ratings.push({ user, rating });

    await apartment.save();
    await DisconnectMongoDB();
    return NextResponse.json(
      { success: true, data: apartment },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
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
    await ConnectMongoDB();

    const findAppartment = await Apartment.findById(apartmentID);

    return NextResponse.json(
      { success: true, data: findAppartment?.averageRating },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server error" },
      { status: 500 }
    );
  }
}
