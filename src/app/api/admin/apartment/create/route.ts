import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwtSecret";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import Apartment from "@/models/Apartment";
import { uploadImage } from "@/utilis/uploadImage";
import { LISTING_MIN_DESCRIPTION_LENGTH, resolveMembershipPlan } from "@/lib/listingMembershipPlans";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const authHeader = req.headers.get("authorization");
    const cookieToken = req.cookies.get("token")?.value;
    const localStorageToken = req.headers.get("x-auth-token");
    const token = authHeader?.split(" ")[1] || cookieToken || localStorageToken;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let decoded: { id?: string };
    try {
      decoded = jwt.verify(token, getJwtSecret(), {
        algorithms: ["HS256"],
      }) as { id?: string };
    } catch {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Access denied. Admin only." }, { status: 403 });
    }

    const formData = await req.formData();

    const ownerEmailRaw = (formData.get("ownerEmail") as string | null)?.trim() || "";
    const ownerEmail = ownerEmailRaw.toUpperCase();

    const apartmentName = (formData.get("apartmentName") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const price = Number(formData.get("price"));
    const contactNo = Number(formData.get("contactNo"));
    const facility = (formData.get("facility") as string) || "";
    const furniture = (formData.get("furniture") as string) || "";
    const location = (formData.get("location") as string)?.trim();
    const availableFor = (formData.get("availableFor") as string)?.trim();
    const categoryRaw = (formData.get("category") as string)?.trim();
    const membershipPlanValue = (formData.get("membershipPlan") as string)?.trim();

    const latitude = formData.get("latitude");
    const longitude = formData.get("longitude");

    const imageFiles = formData.getAll("image") as File[];

    if (!ownerEmail) {
      return NextResponse.json(
        { success: false, message: "Owner email is required" },
        { status: 400 }
      );
    }

    if (
      !apartmentName ||
      !description ||
      !Number.isFinite(price) ||
      price < 1 ||
      !Number.isFinite(contactNo) ||
      !location ||
      !categoryRaw ||
      !availableFor ||
      !membershipPlanValue
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required listing fields" },
        { status: 400 }
      );
    }

    const contactDigits = String(contactNo).replace(/\D/g, "");
    if (contactDigits.length < 10) {
      return NextResponse.json(
        { success: false, message: "Contact number must have at least 10 digits" },
        { status: 400 }
      );
    }

    if (description.trim().length < LISTING_MIN_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          message: `Description must be at least ${LISTING_MIN_DESCRIPTION_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    const owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
      return NextResponse.json(
        { success: false, message: "No account found with that email" },
        { status: 404 }
      );
    }

    if (owner.role !== "OWNER") {
      return NextResponse.json(
        {
          success: false,
          message: "That email is not registered as a property owner. Only OWNER accounts can hold listings.",
        },
        { status: 400 }
      );
    }

    const resolved = resolveMembershipPlan(categoryRaw, membershipPlanValue);
    if (!resolved) {
      return NextResponse.json(
        { success: false, message: "Invalid membership plan for this category" },
        { status: 400 }
      );
    }

    const membershipDuration = resolved.duration;

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { success: false, message: "Upload at least one image" },
        { status: 400 }
      );
    }

    if (imageFiles.length > 10) {
      return NextResponse.json(
        { success: false, message: "You can upload a maximum of 10 images" },
        { status: 400 }
      );
    }

    const image_urls: string[] = [];
    for (const imageFile of imageFiles) {
      const imageUrl = await uploadImage(imageFile, "VRENTAL");
      if (imageUrl) image_urls.push(imageUrl);
    }

    if (image_urls.length === 0) {
      return NextResponse.json(
        { success: false, message: "No images were successfully uploaded" },
        { status: 400 }
      );
    }

    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(expiryDate.getMonth() + membershipDuration);

    const txnID = `ADMIN_GRANT_${Date.now()}`;

    const apartmentData: Record<string, unknown> = {
      apartmentName,
      description,
      price,
      image_urls,
      location,
      facility,
      furniture,
      category: categoryRaw,
      availableFor,
      contactNo,
      ownerID: owner._id,
      status: "Available For Rent",
      paymentStatus: "Verified",
      txnID,
      paymentAmount: 0,
      paymentDate: currentDate,
      membershipDuration,
      memberShipExpiry: expiryDate,
    };

    if (latitude && longitude) {
      apartmentData.coordinates = {
        latitude: Number(latitude),
        longitude: Number(longitude),
      };
    }

    const newApartment = await Apartment.create(apartmentData);

    await User.findByIdAndUpdate(
      owner._id,
      { $addToSet: { apartments: newApartment._id } },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Apartment created for owner with complimentary membership",
        data: {
          apartment: newApartment,
          ownerEmail: owner.email,
          planLabel: resolved.name,
          membershipDuration,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin create apartment error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
