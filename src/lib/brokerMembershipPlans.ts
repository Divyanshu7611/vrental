export type BrokerPlan = {
  name: string;
  value: string;
  duration: number;
  price: number;
  features: string[];
};

export const BROKER_FREE_LISTINGS_PER_MONTH = 3;

export const BROKER_MEMBERSHIP_PLANS: BrokerPlan[] = [
  {
    name: "1 Month",
    value: "1month",
    duration: 1,
    price: 2000,
    features: ["Verified broker profile", "3 free listings/month", "Profile on listing pages"],
  },
  {
    name: "3 Months",
    value: "3months",
    duration: 3,
    price: 5500,
    features: ["Verified broker profile", "3 free listings/month", "Profile on listing pages", "Priority visibility"],
  },
  {
    name: "6 Months",
    value: "6months",
    duration: 6,
    price: 10000,
    features: ["Verified broker profile", "3 free listings/month", "Profile on listing pages", "Maximum savings"],
  },
];

export function resolveBrokerPlan(planValue: string): BrokerPlan | null {
  const v = (planValue ?? "").trim().toLowerCase();
  return BROKER_MEMBERSHIP_PLANS.find((p) => p.value.toLowerCase() === v) ?? null;
}
