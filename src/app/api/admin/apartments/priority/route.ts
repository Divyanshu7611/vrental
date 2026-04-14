import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectMongoDB } from "@/utilis/dbConnect";
import Apartment from "@/models/Apartment";
import User from "@/models/User";
import { DEFAULT_CATEGORY_ORDER } from "@/utilis/apartmentListSort";

export const dynamic = "force-dynamic";

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return { error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
  let decoded: { id?: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "Divyanshu", {
      algorithms: ["HS256"],
    }) as { id?: string };
  } catch {
    return { error: NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 }) };
  }
  await connectMongoDB();
  const admin = await User.findById(decoded.id);
  if (!admin || admin.role !== "ADMIN") {
    return {
      error: NextResponse.json({ success: false, message: "Access denied. Admin only." }, { status: 403 }),
    };
  }
  return { admin };
}

/** Set category list position (1 = first). Omit or null to reset to automatic bucket. */
export async function PATCH(req: NextRequest) {
  const gate = await requireAdmin(req);
  if ("error" in gate) return gate.error;

  try {
    const body = await req.json();
    const apartmentId = body?.apartmentId as string | undefined;
    const rawOrder = body?.categoryFeaturedOrder;

    if (!apartmentId || !mongoose.Types.ObjectId.isValid(apartmentId)) {
      return NextResponse.json(
        { success: false, message: "Valid apartmentId is required" },
        { status: 400 }
      );
    }

    if (rawOrder === null || rawOrder === undefined || rawOrder === "") {
      await Apartment.findByIdAndUpdate(apartmentId, {
        $set: { categoryFeaturedOrder: DEFAULT_CATEGORY_ORDER },
      });
      return NextResponse.json({
        success: true,
        message: "Order reset to default",
        data: { categoryFeaturedOrder: DEFAULT_CATEGORY_ORDER },
      });
    }

    const order = Math.floor(Number(rawOrder));
    if (!Number.isFinite(order) || order < 1 || order > 999_999) {
      return NextResponse.json(
        { success: false, message: "Order must be an integer between 1 and 999999" },
        { status: 400 }
      );
    }

    const updated = await Apartment.findByIdAndUpdate(
      apartmentId,
      { $set: { categoryFeaturedOrder: order } },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ success: false, message: "Apartment not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Display order updated",
      data: { categoryFeaturedOrder: updated.categoryFeaturedOrder },
    });
  } catch (e) {
    console.error("admin apartments priority:", e);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
