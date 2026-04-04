import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectMongoDB } from "@/utilis/dbConnect";
import Apartment from "@/models/Apartment";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      apartmentID,
      userID,
      duration,
      amount,
    } = await req.json();

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    // Calculate expiry date
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(expiryDate.getMonth() + duration);

    // Check if apartmentID is a temporary ID (for new listings)
    const isTempID = apartmentID && apartmentID.toString().startsWith("temp_");

    if (isTempID) {
      // For new apartment listings, just verify payment and return success
      // The apartment will be created after this verification
      return NextResponse.json(
        {
          success: true,
          message: "Payment verified successfully",
          data: {
            paymentID: razorpay_payment_id,
            expiryDate,
            duration,
            amount,
          },
        },
        { status: 200 }
      );
    }

    // For existing apartments (membership renewal), update the apartment
    const apartment = await Apartment.findById(apartmentID);

    if (!apartment) {
      return NextResponse.json(
        {
          success: false,
          message: "Apartment not found",
        },
        { status: 404 }
      );
    }

    // Update apartment with membership details
    apartment.paymentStatus = "Verified";
    apartment.txnID = razorpay_payment_id;
    apartment.paymentDate = currentDate;
    apartment.paymentAmount = amount;
    apartment.memberShipExpiry = expiryDate;
    apartment.membershipDuration = duration;
    apartment.status = "Available For Rent";

    await apartment.save();

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified and apartment activated",
        data: {
          apartmentID,
          expiryDate,
          paymentID: razorpay_payment_id,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
