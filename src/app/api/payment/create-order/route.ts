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

let razorpaySingleton: Razorpay | null = null;

function getRazorpay(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id?.trim() || !key_secret?.trim()) {
    throw new Error(
      "Server Razorpay keys missing: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env (same account as NEXT_PUBLIC_RAZORPAY_KEY_ID)."
    );
  }
  if (!razorpaySingleton) {
    razorpaySingleton = new Razorpay({ key_id, key_secret });
  }
  return razorpaySingleton;
}

function razorpayErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") return String(error);
  const e = error as {
    message?: string;
    error?: { description?: string; code?: string };
    statusCode?: number;
  };
  return (
    e.error?.description ||
    e.error?.code ||
    e.message ||
    "Unknown Razorpay error"
  );
}

export async function POST(req: NextRequest) {
  try {
    const { amount, apartmentID, userID, duration } = await req.json();

    const amountRupees = Number(amount);
    const durationMonths = Number(duration);

    if (
      apartmentID == null ||
      String(apartmentID).trim() === "" ||
      userID == null ||
      String(userID).trim() === "" ||
      !Number.isFinite(amountRupees) ||
      amountRupees < 1 ||
      !Number.isFinite(durationMonths) ||
      durationMonths < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid payment fields",
        },
        { status: 400 }
      );
    }

    const amountPaise = Math.round(amountRupees * 100);
    if (amountPaise < 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be at least ₹1",
        },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: amountPaise,
      currency: "INR",
      receipt: razorpayReceipt(String(apartmentID), String(userID)),
      notes: {
        apartmentID,
        userID,
        duration: String(durationMonths),
      },
    };

    const order = await getRazorpay().orders.create(options);

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
  } catch (error: unknown) {
    console.error("Error creating Razorpay order:", error);
    const detail = razorpayErrorMessage(error);
    const missingKeys = detail.includes("Server Razorpay keys missing");
    return NextResponse.json(
      {
        success: false,
        message: missingKeys ? detail : "Failed to create order",
        error: detail,
      },
      { status: missingKeys ? 503 : 500 }
    );
  }
}
