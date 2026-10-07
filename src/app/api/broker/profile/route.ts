import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import BrokerProfile from "@/models/BrokerProfile";
import User from "@/models/User";
import { verifyRequestUser } from "@/lib/authFromRequest";
import { uploadImage } from "@/utilis/uploadImage";
import { getBrokerListingQuota } from "@/lib/brokerListing";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const auth = verifyRequestUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const profile = await BrokerProfile.findOne({ userId: auth.id }).lean();
    const quota = await getBrokerListingQuota(auth.id);

    return NextResponse.json({
      success: true,
      data: profile,
      quota,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const auth = verifyRequestUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(auth.id);
    if (!user || user.role !== "BROKER") {
      return NextResponse.json(
        { success: false, message: "Only broker accounts can complete this profile" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const fullName = String(formData.get("fullName") ?? "").trim();
    const mobile = Number(formData.get("mobile"));
    const email = String(formData.get("email") ?? user.email).trim().toUpperCase();
    const firmName = String(formData.get("firmName") ?? "").trim();
    const officeAddress = String(formData.get("officeAddress") ?? "").trim();
    const areasServed = String(formData.get("areasServed") ?? "").trim();
    const reraNumber = String(formData.get("reraNumber") ?? "").trim();
    const brokerageDetails = String(formData.get("brokerageDetails") ?? "").trim();
    const experience = String(formData.get("experience") ?? "").trim();
    const otherDetails = String(formData.get("otherDetails") ?? "").trim();
    const profilePhotoFile = formData.get("profilePhoto") as File | null;
    const reraCertificateFile = formData.get("reraCertificate") as File | null;
    const existingPhoto = String(formData.get("existingProfilePhoto") ?? "").trim();
    const existingCert = String(formData.get("existingReraCertificate") ?? "").trim();

    if (
      !fullName ||
      !Number.isFinite(mobile) ||
      String(mobile).length < 10 ||
      !firmName ||
      !officeAddress ||
      !areasServed ||
      !reraNumber ||
      !brokerageDetails ||
      !experience
    ) {
      return NextResponse.json(
        { success: false, message: "Please fill all required broker profile fields" },
        { status: 400 }
      );
    }

    let profilePhoto = existingPhoto || user.image;
    if (profilePhotoFile && profilePhotoFile.size > 0) {
      const uploaded = await uploadImage(profilePhotoFile, "VRENTAL/broker-profiles");
      if (uploaded) profilePhoto = uploaded;
    }

    let reraCertificateUrl = existingCert;
    if (reraCertificateFile && reraCertificateFile.size > 0) {
      const uploaded = await uploadImage(reraCertificateFile, "VRENTAL/broker-rera");
      if (uploaded) reraCertificateUrl = uploaded;
    }

    if (!reraCertificateUrl) {
      return NextResponse.json(
        { success: false, message: "RERA certificate upload is required" },
        { status: 400 }
      );
    }

    const payload = {
      userId: auth.id,
      fullName,
      profilePhoto,
      mobile,
      email,
      firmName,
      officeAddress,
      areasServed,
      reraNumber,
      reraCertificateUrl,
      brokerageDetails,
      experience,
      otherDetails,
      profileComplete: true,
    };

    const profile = await BrokerProfile.findOneAndUpdate(
      { userId: auth.id },
      { $set: payload },
      { upsert: true, new: true }
    );

    if (profilePhoto && profilePhoto !== user.image) {
      user.image = profilePhoto;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Broker profile saved",
      data: profile,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
