import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/utilis/uploadImage";
import Apartment from "@/models/Apartment";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("id");

  try {
    await connectMongoDB();
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
