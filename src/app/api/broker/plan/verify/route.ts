import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectMongoDB } from "@/utilis/dbConnect";
import BrokerProfile from "@/models/BrokerProfile";
import User from "@/models/User";
import { verifyRequestUser } from "@/lib/authFromRequest";
import { resolveBrokerPlan } from "@/lib/brokerMembershipPlans";

export const dynamic = "force-dynamic";

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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planValue,
      amount,
    } = await req.json();

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
    }

    const plan = resolveBrokerPlan(planValue);
    if (!plan || plan.price !== Number(amount)) {
      return NextResponse.json({ success: false, message: "Invalid plan amount" }, { status: 400 });
    }

    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setMonth(expiryDate.getMonth() + plan.duration);

    const profile = await BrokerProfile.findOneAndUpdate(
      { userId: auth.id },
      {
        $set: {
          paymentStatus: "Verified",
          txnID: razorpay_payment_id,
          paymentDate: now,
          paymentAmount: plan.price,
          planDuration: plan.duration,
          planExpiry: expiryDate,
          isActive: true,
        },
      },
      { new: true, upsert: false }
    );

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Broker profile not found. Complete onboarding first." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Broker plan activated",
      data: { planExpiry: expiryDate, profile },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
