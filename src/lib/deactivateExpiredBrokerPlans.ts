import { connectMongoDB } from "@/utilis/dbConnect";
import BrokerProfile from "@/models/BrokerProfile";
import Apartment from "@/models/Apartment";
import { BROKER_FREE_LISTINGS_PER_MONTH } from "@/lib/brokerMembershipPlans";

export type DeactivatedBrokerSummary = {
  brokerId: string;
  userId: string;
  deactivatedListings: number;
};

export type DeactivateExpiredBrokerPlansResult = {
  brokersProcessed: number;
  listingsDeactivated: number;
  brokers: DeactivatedBrokerSummary[];
};

/**
 * When a broker plan expires: hide profile and deactivate up to 3 broker-plan listings.
 */
export async function deactivateExpiredBrokerPlans(): Promise<DeactivateExpiredBrokerPlansResult> {
  await connectMongoDB();
  const now = new Date();

  const expiredBrokers = await BrokerProfile.find({
    paymentStatus: "Verified",
    isActive: true,
    planExpiry: { $exists: true, $ne: null, $lt: now },
  }).select("_id userId");

  const brokers: DeactivatedBrokerSummary[] = [];
  let listingsDeactivated = 0;

  for (const broker of expiredBrokers) {
    await BrokerProfile.updateOne(
      { _id: broker._id },
      { $set: { isActive: false } }
    );

    const listings = await Apartment.find({
      ownerID: broker.userId,
      listedViaBrokerPlan: true,
      status: { $nin: ["Deactivated", "Draft"] },
    })
      .sort({ paymentDate: -1 })
      .limit(BROKER_FREE_LISTINGS_PER_MONTH)
      .select("_id");

    if (listings.length > 0) {
      const ids = listings.map((l) => l._id);
      const result = await Apartment.updateMany(
        { _id: { $in: ids } },
        {
          $set: {
            status: "Deactivated",
            deactivatedAt: now,
            deactivationReason: "Broker plan expired",
          },
        }
      );
      listingsDeactivated += result.modifiedCount;
    }

    brokers.push({
      brokerId: String(broker._id),
      userId: String(broker.userId),
      deactivatedListings: listings.length,
    });
  }

  return {
    brokersProcessed: expiredBrokers.length,
    listingsDeactivated,
    brokers,
  };
}
