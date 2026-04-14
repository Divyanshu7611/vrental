import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

/** Razorpay requires receipt length ≤ 40 (alphanumeric recommended). */
function razorpayReceipt(apartmentID: string, userID: string): string {
  const raw = `${apartmentID}:${userID}:${Date.now()}:${Math.random()}`;
  const suffix = createHash("sha256").update(raw).digest("hex").slice(0, 37);
  return `v${suffix}`;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, apartmentID, userID, duration } = await req.json();

    if (!amount || !apartmentID || !userID || !duration) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: razorpayReceipt(String(apartmentID), String(userID)),
      notes: {
        apartmentID,
        userID,
        duration: duration.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
