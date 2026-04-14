import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import Apartment from "@/models/Apartment";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { uploadImage } from "@/utilis/uploadImage";

export const dynamic = "force-dynamic";

/**
 * Create or update an apartment draft.
 *
 * - Creates an Apartment with status="Draft" + paymentStatus="Pending"
 * - Uploads images (optional on update; required on create)
 * - Returns draft apartment id so client can continue payment later
 */
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("id");

  try {
    await connectMongoDB();

    // Auth
    const authHeader = req.headers.get("authorization");
    const cookieToken = req.cookies.get("token")?.value;
    const localStorageToken = req.headers.get("x-auth-token");
    const token = authHeader?.split(" ")[1] || cookieToken || localStorageToken;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please login to continue" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "Divyanshu", {
        algorithms: ["HS256"],
      });
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!userId || decoded?.id?.toString() !== userId.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    if (user.role !== "OWNER") {
      return NextResponse.json(
        { success: false, message: "Access denied. Only owners can list properties." },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const draftId = (formData.get("draftId") as string | null)?.trim() || null;

    const apartmentName = formData.get("apartmentName") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const contactNo = Number(formData.get("contactNo"));
    const facility = formData.get("facility") as string;
    const furniture = formData.get("furniture") as string;
    const location = formData.get("location") as string;
    const availableFor = formData.get("availableFor") as string;
    const category = formData.get("category") as string;

    const paymentAmountRaw = formData.get("paymentAmount");
    const membershipDurationRaw = formData.get("membershipDuration");
    const paymentAmount =
      paymentAmountRaw != null && String(paymentAmountRaw).trim() !== ""
        ? Number(paymentAmountRaw)
        : undefined;
    const membershipDuration =
      membershipDurationRaw != null && String(membershipDurationRaw).trim() !== ""
        ? Number(membershipDurationRaw)
        : undefined;

    const latitude = formData.get("latitude");
    const longitude = formData.get("longitude");

    const imageFiles = formData.getAll("image") as File[];
    const imageUrlsJson = (formData.get("image_urls") as string | null)?.trim() || null;

    if (imageFiles.length > 10) {
      return NextResponse.json(
        { success: false, message: "You can upload a maximum of 10 images" },
        { status: 400 }
      );
    }

    let baseImageUrls: string[] = [];
    if (imageUrlsJson) {
      try {
        const parsed = JSON.parse(imageUrlsJson);
        if (Array.isArray(parsed) && parsed.every((u) => typeof u === "string")) {
          baseImageUrls = parsed;
        }
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid image_urls payload" },
          { status: 400 }
        );
      }
    }

    let image_urls: string[] | undefined = undefined;
    if (imageFiles.length > 0) {
      image_urls = [...baseImageUrls];
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
    } else if (imageUrlsJson) {
      // Update ordering / keep existing URLs without uploading new files
      image_urls = baseImageUrls;
    }

    const update: any = {
      apartmentName,
      description,
      price,
      contactNo,
      facility,
      furniture,
      location,
      availableFor,
      category,
      ownerID: userId,
      status: "Draft",
      paymentStatus: "Pending",
    };

    if (paymentAmount != null && !Number.isNaN(paymentAmount)) {
      update.paymentAmount = paymentAmount;
    }
    if (membershipDuration != null && !Number.isNaN(membershipDuration)) {
      update.membershipDuration = membershipDuration;
      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setMonth(expiryDate.getMonth() + membershipDuration);
      update.memberShipExpiry = expiryDate;
    }

    if (latitude && longitude) {
      update.coordinates = {
        latitude: Number(latitude),
        longitude: Number(longitude),
      };
    }

    if (image_urls) {
      update.image_urls = image_urls;
    }

    let draft;
    if (draftId) {
      // Update existing draft (must belong to same owner)
      const existing = await Apartment.findById(draftId);
      if (!existing) {
        return NextResponse.json(
          { success: false, message: "Draft not found" },
          { status: 404 }
        );
      }
      if (existing.ownerID.toString() !== userId.toString()) {
        return NextResponse.json(
          { success: false, message: "Unauthorized: Not the owner" },
          { status: 403 }
        );
      }
      draft = await Apartment.findByIdAndUpdate(draftId, update, { new: true });
    } else {
      // Create new draft (requires at least one image)
      if (!image_urls || image_urls.length === 0) {
        return NextResponse.json(
          { success: false, message: "Please upload at least one image" },
          { status: 400 }
        );
      }
      draft = await Apartment.create(update);
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { apartments: draft._id } },
        { new: true }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Draft saved",
        data: draft,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Draft save error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

