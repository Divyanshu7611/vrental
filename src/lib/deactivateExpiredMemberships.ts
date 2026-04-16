import { connectMongoDB } from "@/utilis/dbConnect";
import Apartment from "@/models/Apartment";

export type DeactivatedApartmentSummary = {
  id: string;
  name: string;
  expiryDate: Date;
};

export type DeactivateExpiredMembershipsResult = {
  modifiedCount: number;
  matchedCount: number;
  deactivated: DeactivatedApartmentSummary[];
};

/**
 * Sets status to "Deactivated" for paid listings whose membership end date is in the past.
 * Skips drafts and already-deactivated rows.
 */
export async function deactivateExpiredMembershipApartments(): Promise<DeactivateExpiredMembershipsResult> {
  await connectMongoDB();
  const currentDate = new Date();

  const filter = {
    memberShipExpiry: { $exists: true, $ne: null, $lt: currentDate },
    status: { $nin: ["Deactivated", "Draft"] },
  };

  const expiredApartments = await Apartment.find(filter)
    .select("_id apartmentName memberShipExpiry")
    .lean();

  if (expiredApartments.length === 0) {
    return { modifiedCount: 0, matchedCount: 0, deactivated: [] };
  }

  const updateResult = await Apartment.updateMany(filter, {
    $set: {
      status: "Deactivated",
      deactivatedAt: currentDate,
      deactivationReason: "Membership expired",
    },
  });

  return {
    modifiedCount: updateResult.modifiedCount,
    matchedCount: updateResult.matchedCount ?? 0,
    deactivated: expiredApartments.map((apt) => ({
      id: String(apt._id),
      name: String(apt.apartmentName ?? ""),
      expiryDate: new Date(apt.memberShipExpiry as Date),
    })),
  };
}
