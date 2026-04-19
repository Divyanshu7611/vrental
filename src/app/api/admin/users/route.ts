import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwtSecret";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    // Verify admin authentication
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, getJwtSecret(), {
        algorithms: ["HS256"],
      });
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token", success: false },
        { status: 401 }
      );
    }

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Access denied. Admin only.", success: false },
        { status: 403 }
      );
    }

    // Get all users
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: "Users fetched successfully",
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
