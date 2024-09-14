import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import Apartment from "@/models/Apartment";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const apartmentId = url.searchParams.get("id");

  try {
    await connectMongoDB();

    // Extract token from Bearer header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided", success: false },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decodedToken: string | JwtPayload;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token", success: false },
        { status: 401 }
      );
    }

    // Type assertion to ensure decodedToken is of type JwtPayload
    if (typeof decodedToken === "string" || !("id" in decodedToken)) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token payload", success: false },
        { status: 401 }
      );
    }

    const { id } = decodedToken as JwtPayload;

    // Check if the apartment exists
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return NextResponse.json(
        { message: "Apartment not found", success: false },
        { status: 404 }
      );
    }

    // Ensure the current user is the owner of the apartment
    if (apartment.ownerID.toString() !== id) {
      return NextResponse.json(
        { message: "Unauthorized: Not the owner", success: false },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const apartmentName = formData.get("apartmentName") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const contactNo = Number(formData.get("contactNo"));
    const facility = formData.get("facility") as string;
    const furniture = formData.get("furniture") as string;
    const location = formData.get("location") as string;
    const availableFor = formData.get("availableFor") as string;
    const category = formData.get("category") as string;

    // Update the apartment
    const updatedApartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      {
        apartmentName,
        description,
        price,
        location,
        facility,
        furniture,
        category,
        availableFor,
        contactNo,
      },
      { new: true }
    );

    if (!updatedApartment) {
      return NextResponse.json(
        { message: "Apartment not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Apartment Updated Successfully",
        success: true,
        apartment: updatedApartment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
