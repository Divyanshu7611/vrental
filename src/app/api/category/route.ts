import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/Category";

export async function POST(request: NextRequest) {
  const { category } = await request.json();

  try {
    await ConnectMongoDB();

    // Validation
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all details",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await Category.findOne({ category });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "CateGory Already Exists",
        },
        { status: 400 }
      );
    }

    const newUser = await Category.create({
      category,
    });

    return NextResponse.json(
      {
        message: "Category Created Successfuly",
        success: true,
      },
      { status: 200 }
    );
    await DisconnectMongoDB();
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
      },
      { status: 500 }
    );
  }
}

// get route

export async function GET(req: NextRequest) {
  try {
    await ConnectMongoDB();
    const categories = await Category.find({});
    return NextResponse.json(
      {
        success: true,
        message: "All Categories Fetched Properly",
      },
      { status: 200 }
    );
    await DisconnectMongoDB();
  } catch (error) {
    console.log(error);
    NextResponse.error();
  }
}
