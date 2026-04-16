import { NextRequest, NextResponse } from "next/server";
import { deactivateExpiredMembershipApartments } from "@/lib/deactivateExpiredMemberships";
import { isCronRouteAuthorized } from "./auth";

export const dynamic = "force-dynamic";

async function runJob() {
  const result = await deactivateExpiredMembershipApartments();

  if (result.deactivated.length === 0) {
    return NextResponse.json(
      {
        success: true,
        message: "No expired memberships found",
        count: 0,
        modifiedCount: 0,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: `Successfully deactivated ${result.modifiedCount} expired apartment(s)`,
      count: result.modifiedCount,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      apartments: result.deactivated,
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
