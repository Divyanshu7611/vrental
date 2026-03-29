import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/utilis/uploadImage";
import Apartment from "@/models/Apartment";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("id");

  try {
    await connectMongoDB();

    // Verify authentication and role
    const token = req.headers.get("authorization")?.split(" ")[1] || req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized - Please login to continue",
          success: false,
        },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        {
          message: "Invalid or expired token",
          success: false,
        },
        { status: 401 }
      );
    }

    // Check if user is OWNER
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    if (user.role !== "OWNER") {
      return NextResponse.json(
        {
          message: "Access denied. Only property owners can list properties.",
          success: false,
          requiredRole: "OWNER",
          currentRole: user.role,
        },
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
    const imageFiles = formData.getAll("image") as File[];
    const category = formData.get("category") as string;
    const txnID = formData.get("txnID") as string;
    const paymentAmount = Number(formData.get("paymentAmount"));
    const membershipDuration = Number(formData.get("membershipDuration"));


    // Validation
    // if (
    //   !apartmentName ||
    //   !description ||
    //   !price ||
    //   imageFiles.length === 0 ||
    //   !location ||
    //   !facility ||
    //   !furniture ||
    //   !category ||
    //   !availableFor ||
    //   !contactNo
    // ) {
    //   return NextResponse.json(
    //     {
    //       message: "All Fields Are Mandatory",
    //       success: false,
    //     },
    //     { status: 400 }
    //   );
    // }

    // Check if the number of images exceeds the limit
    if (imageFiles.length > 5) {
      return NextResponse.json(
        {
          message: "You can upload a maximum of 5 images",
          success: false,
        },
        { status: 400 }
      );
    }

    let image_urls: string[] = [];

    for (const imageFile of imageFiles) {
      try {
        console.log(`Processing file: ${imageFile.name}`);
        const imageUrl = await uploadImage(imageFile, "VRENTAL");
        if (imageUrl) {
          image_urls.push(imageUrl);
        } else {
          console.error(`Failed to upload ${imageFile.name}: No URL returned`);
        }
      } catch (uploadError) {
        console.error(`Failed to upload ${imageFile.name}:`, uploadError);
      }
    }

    console.log("Image URLs:", image_urls);

    if (image_urls.length === 0) {
      console.error("No images were successfully uploaded");
      return NextResponse.json(
        {
          message: "No images were successfully uploaded",
          success: false,
        },
        { status: 400 }
      );
    }

    // Calculate membership expiry date
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(expiryDate.getMonth() + membershipDuration);

    // Create new apartment
    const newApartment = await Apartment.create({
      apartmentName,
      description,
      price,
      image_urls,
      location,
      facility,
      furniture,
      category,
      availableFor,
      contactNo,
      ownerID: userId,
      status: "Available For Rent",
      paymentStatus: txnID ? "Verified" : "Pending", // If txnID exists (from Razorpay), mark as Verified
      txnID,
      paymentAmount,
      paymentDate: txnID ? currentDate : undefined,
      membershipDuration,
      memberShipExpiry: expiryDate,
    });

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { apartments: newApartment._id } },
      { new: true }
    );

    const updatedUser = await User.findById(userId).populate("apartments");
    return NextResponse.json(
      {
        message: "Apartment Created Successfully",
        success: true,
        apartment: newApartment,
        user: updatedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    // await DisconnectMongoDB();
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
