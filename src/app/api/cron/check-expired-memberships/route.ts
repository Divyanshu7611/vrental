import { NextRequest, NextResponse } from "next/server";
import { deactivateExpiredMembershipApartments } from "@/lib/deactivateExpiredMemberships";
import { deactivateExpiredBrokerPlans } from "@/lib/deactivateExpiredBrokerPlans";
import { isCronRouteAuthorized } from "./auth";

export const dynamic = "force-dynamic";

async function runJob() {
  const [listingResult, brokerResult] = await Promise.all([
    deactivateExpiredMembershipApartments(),
    deactivateExpiredBrokerPlans(),
  ]);

  return NextResponse.json(
    {
      success: true,
      message: "Membership expiry check completed",
      listings: {
        modifiedCount: listingResult.modifiedCount,
        matchedCount: listingResult.matchedCount,
        deactivated: listingResult.deactivated,
      },
      brokers: {
        brokersProcessed: brokerResult.brokersProcessed,
        listingsDeactivated: brokerResult.listingsDeactivated,
        details: brokerResult.brokers,
      },
    },
    { status: 200 }
  );
}

export async function GET(req: NextRequest) {
  try {
    if (!isCronRouteAuthorized(req)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return await runJob();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error checking expired memberships:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check expired memberships",
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
