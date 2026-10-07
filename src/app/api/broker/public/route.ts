import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import BrokerProfile from "@/models/BrokerProfile";
import { isBrokerPlanActive } from "@/lib/brokerListing";

export const dynamic = "force-dynamic";

/** Public broker profile for apartment detail pages (only when plan is active). */
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const userId = new URL(req.url).searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ success: false, message: "userId required" }, { status: 400 });
    }

    const profile = await BrokerProfile.findOne({ userId }).lean();
    if (!profile || !profile.profileComplete || !isBrokerPlanActive(profile as any)) {
      return NextResponse.json({ success: true, data: null });
    }

    const { reraCertificateUrl, txnID, paymentAmount, ...publicProfile } = profile as Record<string, unknown>;
    void reraCertificateUrl;
    void txnID;
    void paymentAmount;

    return NextResponse.json({ success: true, data: publicProfile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
