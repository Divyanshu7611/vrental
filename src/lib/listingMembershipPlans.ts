/** Flat per-listing membership pricing — keep in sync with payment UI. */

export const LISTING_MIN_DESCRIPTION_LENGTH = 10;

export type ListingPlan = {
  name: string;
  value: string;
  duration: number;
  price: number;
  originalPrice: number;
  savings: string;
};

/** Same pricing for all apartment categories. */
export const FLAT_LISTING_PLANS: ListingPlan[] = [
  { name: "1 Month", value: "1month", duration: 1, price: 1000, originalPrice: 1000, savings: "Per listing" },
  { name: "3 Months", value: "3months", duration: 3, price: 2500, originalPrice: 2500, savings: "Best value" },
  { name: "6 Months", value: "6months", duration: 6, price: 5000, originalPrice: 5000, savings: "Maximum visibility" },
];

export function normalizeListingCategory(raw: string | undefined): string {
  const c = (raw ?? "").trim().toUpperCase();
  if (c === "CO_LIVING" || c === "COLIVING") return "CO-LIVING";
  return c;
}

export function getMembershipPlansForCategory(_categoryRaw?: string | undefined): ListingPlan[] {
  return FLAT_LISTING_PLANS;
}

export function resolveMembershipPlan(
  categoryRaw: string | undefined,
  planValue: string
): ListingPlan | null {
  const v = (planValue ?? "").trim().toLowerCase();
  const plans = getMembershipPlansForCategory(categoryRaw);
  return plans.find((p) => p.value.toLowerCase() === v) ?? null;
}
