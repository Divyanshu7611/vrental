import BrokerProfile, { IBrokerProfile } from "@/models/BrokerProfile";
import { BROKER_FREE_LISTINGS_PER_MONTH } from "@/lib/brokerMembershipPlans";

export function getCurrentMonthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function isBrokerPlanActive(profile: IBrokerProfile | null): boolean {
  if (!profile) return false;
  if (profile.paymentStatus !== "Verified") return false;
  if (!profile.isActive) return false;
  if (!profile.planExpiry) return false;
  return new Date(profile.planExpiry) > new Date();
}

export async function resetBrokerMonthlyCounterIfNeeded(profile: IBrokerProfile): Promise<void> {
  const currentMonth = getCurrentMonthKey();
  if (profile.monthlyListingResetMonth !== currentMonth) {
    profile.monthlyListingsUsed = 0;
    profile.monthlyListingResetMonth = currentMonth;
    await profile.save();
  }
}

export type BrokerListingQuota = {
  planActive: boolean;
  profileComplete: boolean;
  profileVisible: boolean;
  remainingFreeListings: number;
  canListFree: boolean;
  planExpiry: Date | null;
};

export async function getBrokerListingQuota(userId: string): Promise<BrokerListingQuota> {
  const profile = await BrokerProfile.findOne({ userId });
  if (!profile) {
    return {
      planActive: false,
      profileComplete: false,
      profileVisible: false,
      remainingFreeListings: 0,
      canListFree: false,
      planExpiry: null,
    };
  }

  await resetBrokerMonthlyCounterIfNeeded(profile);

  const planActive = isBrokerPlanActive(profile);
  const remaining = Math.max(0, BROKER_FREE_LISTINGS_PER_MONTH - (profile.monthlyListingsUsed ?? 0));

  return {
    planActive,
    profileComplete: profile.profileComplete,
    profileVisible: planActive && profile.profileComplete && profile.isActive,
    remainingFreeListings: planActive ? remaining : 0,
    canListFree: planActive && profile.profileComplete && remaining > 0,
    planExpiry: profile.planExpiry ?? null,
  };
}
