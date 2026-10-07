import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import Apartment from "@/models/Apartment";
import BrokerProfile from "@/models/BrokerProfile";
import User from "@/models/User";
import { verifyRequestUser } from "@/lib/authFromRequest";
import {
  getBrokerListingQuota,
  isBrokerPlanActive,
  resetBrokerMonthlyCounterIfNeeded,
} from "@/lib/brokerListing";
import { BROKER_FREE_LISTINGS_PER_MONTH } from "@/lib/brokerMembershipPlans";

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

    const { apartmentID } = await req.json();
    if (!apartmentID) {
      return NextResponse.json({ success: false, message: "apartmentID required" }, { status: 400 });
    }

    const quota = await getBrokerListingQuota(auth.id);
    if (!quota.canListFree) {
      return NextResponse.json(
        {
          success: false,
          message: quota.planActive
            ? `Monthly free listing limit reached (${BROKER_FREE_LISTINGS_PER_MONTH}/month). Renew next month or contact support.`
            : "Active broker plan required. Purchase a broker profile plan to list for free.",
        },
        { status: 403 }
      );
    }

    const apartment = await Apartment.findById(apartmentID);
    if (!apartment || apartment.ownerID.toString() !== auth.id) {
      return NextResponse.json({ success: false, message: "Listing not found" }, { status: 404 });
    }

    const profile = await BrokerProfile.findOne({ userId: auth.id });
    if (!profile || !isBrokerPlanActive(profile)) {
      return NextResponse.json({ success: false, message: "Active broker plan required" }, { status: 403 });
    }

    await resetBrokerMonthlyCounterIfNeeded(profile);

    const now = new Date();
    apartment.paymentStatus = "Verified";
    apartment.status = "Available For Rent";
    apartment.paymentDate = now;
    apartment.paymentAmount = 0;
    apartment.memberShipExpiry = profile.planExpiry!;
    apartment.membershipDuration = profile.planDuration;
    apartment.listedViaBrokerPlan = true;
    apartment.txnID = `BROKER-${profile.txnID ?? "PLAN"}`;
    await apartment.save();

    profile.monthlyListingsUsed = (profile.monthlyListingsUsed ?? 0) + 1;
    await profile.save();

    return NextResponse.json({
      success: true,
      message: "Property listed under your broker plan",
      data: {
        apartmentID,
        remainingFreeListings: Math.max(0, BROKER_FREE_LISTINGS_PER_MONTH - profile.monthlyListingsUsed),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
