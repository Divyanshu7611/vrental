import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/utilis/uploadImage";
import Apartment from "@/models/Apartment";
import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";
import Category from "@/models/Category";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export async function POST(req: NextRequest) {
  try {
    await ConnectMongoDB();
    const formData = await req.formData();

    const apartmentName = formData.get("apartmentName") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const facility = formData.get("facility") as string;
    const furnitureDescription = formData.get("furnitureDescription") as string;
    const location = formData.get("location") as string;
    const furniture = formData.get("furniture") === "true";
    const parking = formData.get("parking") === "true";
    const electricity = formData.get("electricity") === "true";
    const imageFiles = formData.getAll("image") as File[];
    const category = formData.get("category") as string;

    console.log(
      `Received ${imageFiles.length} image files:`,
      imageFiles.map((f) => f.name)
    );

    // Validation
    if (
      !apartmentName ||
      !description ||
      !price ||
      imageFiles.length === 0 ||
      !location ||
      !facility ||
      !furnitureDescription ||
      furniture === undefined ||
      parking === undefined ||
      electricity === undefined ||
      !category
    ) {
      return NextResponse.json(
        {
          message: "All Fields Are Mandatory",
          success: false,
        },
        { status: 400 }
      );
    }

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
    let public_ids: string[] = [];

    for (const imageFile of imageFiles) {
      try {
        console.log(`Processing file: ${imageFile.name}`);
        const imageUrl = await uploadImage(imageFile, "VRENTAL");
        if (imageUrl) {
          image_urls.push(imageUrl);

          // Extract public_id from the URL
          const publicId = imageUrl.split("/").pop()?.split(".")[0] || "";
          public_ids.push(publicId);
          console.log(
            `Successfully uploaded ${imageFile.name}. URL: ${imageUrl}, Public ID: ${publicId}`
          );
        } else {
          console.error(`Failed to upload ${imageFile.name}: No URL returned`);
        }
      } catch (uploadError) {
        console.error(`Failed to upload ${imageFile.name}:`, uploadError);
      }
    }

    console.log("Image URLs:", image_urls);
    console.log("Public IDs:", public_ids);

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
    // check category exist or not
    const checkCategory = Category.findOne({ category });

    if (!checkCategory) {
      return NextResponse.json(
        {
          message: "Category Does Not Exits",
          success: false,
        },
        { status: 403 }
      );
    }

    // Create new apartment
    const newApartment = await Apartment.create({
      apartmentName,
      description,
      price,
      image_urls,
      public_ids,
      location,
      furniture,
      furnitureDescription,
      electricity,
      parking,
      facility,
      category,
      // category: checkCategory!._id,
    });
    // push appartment into user
    // await Category.updateOne(
    //   { _id: checkCategory!._id },
    //   { $addToSet: { houselist: newApartment._id } }
    // );
    // await DisconnectMongoDB();

    return NextResponse.json(
      {
        message: "Apartment Created Successfully",
        success: true,
        apartment: newApartment,
      },
      { status: 201 }
    );
  } catch (error) {
    await DisconnectMongoDB();
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
