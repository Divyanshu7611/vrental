import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectMongoDB } from "@/utilis/dbConnect";
import BrokerProfile from "@/models/BrokerProfile";
import User from "@/models/User";
import { verifyRequestUser } from "@/lib/authFromRequest";
import { resolveBrokerPlan } from "@/lib/brokerMembershipPlans";

export const dynamic = "force-dynamic";

function razorpayReceipt(userId: string): string {
  const raw = `broker:${userId}:${Date.now()}:${Math.random()}`;
  return `b${createHash("sha256").update(raw).digest("hex").slice(0, 39)}`;
}

let razorpaySingleton: Razorpay | null = null;

function getRazorpay(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id?.trim() || !key_secret?.trim()) {
    throw new Error("Razorpay keys missing on server");
  }
  if (!razorpaySingleton) {
    razorpaySingleton = new Razorpay({ key_id, key_secret });
  }
  return razorpaySingleton;
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
      return NextResponse.json({ success: false, message: "Broker account required" }, { status: 403 });
    }

    const profile = await BrokerProfile.findOne({ userId: auth.id });
    if (!profile?.profileComplete) {
      return NextResponse.json(
        { success: false, message: "Complete your broker profile before purchasing a plan" },
        { status: 400 }
      );
    }

    const { planValue } = await req.json();
    const plan = resolveBrokerPlan(planValue);
    if (!plan) {
      return NextResponse.json({ success: false, message: "Invalid broker plan" }, { status: 400 });
    }

    const order = await getRazorpay().orders.create({
      amount: Math.round(plan.price * 100),
      currency: "INR",
      receipt: razorpayReceipt(auth.id),
      notes: {
        type: "broker_plan",
        userId: auth.id,
        duration: String(plan.duration),
        planValue: plan.value,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        plan,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
