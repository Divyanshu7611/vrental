import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import { verifyRequestUser } from "@/lib/authFromRequest";
import { getBrokerListingQuota } from "@/lib/brokerListing";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const auth = verifyRequestUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const quota = await getBrokerListingQuota(auth.id);
    return NextResponse.json({ success: true, data: quota });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
