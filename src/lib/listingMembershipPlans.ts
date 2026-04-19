/** Mirrors owner listing flow in `Step1.tsx` — keep in sync when pricing changes. */

export const LISTING_MIN_DESCRIPTION_LENGTH = 10;

export type ListingPlan = {
  name: string;
  value: string;
  duration: number;
  price: number;
  originalPrice: number;
  savings: string;
};

export function normalizeListingCategory(raw: string | undefined): string {
  const c = (raw ?? "").trim().toUpperCase();
  if (c === "CO_LIVING" || c === "COLIVING") return "CO-LIVING";
  return c;
}

export function getMembershipPlansForCategory(categoryRaw: string | undefined): ListingPlan[] {
  const category = normalizeListingCategory(categoryRaw);
  if (category === "ROOM" || category === "PG" || category === "HOSTEL" || category === "CO-LIVING") {
    return [
      { name: "1 Month", value: "1month", duration: 1, price: 99, originalPrice: 198, savings: "Save 50%" },
      { name: "3 Months", value: "3months", duration: 3, price: 199, originalPrice: 398, savings: "Save 50%" },
      { name: "6 Months", value: "6months", duration: 6, price: 299, originalPrice: 598, savings: "Save 50%" },
    ];
  }
  if (category === "FLAT") {
    return [
      { name: "1 Month", value: "1month", duration: 1, price: 199, originalPrice: 398, savings: "Save 50%" },
      { name: "3 Months", value: "3months", duration: 3, price: 399, originalPrice: 798, savings: "Save 50%" },
      { name: "6 Months", value: "6months", duration: 6, price: 599, originalPrice: 1198, savings: "Save 50%" },
    ];
  }
  if (category === "SHOP") {
    return [
      { name: "1 Month", value: "1month", duration: 1, price: 299, originalPrice: 598, savings: "Save 50%" },
      { name: "3 Months", value: "3months", duration: 3, price: 699, originalPrice: 1398, savings: "Save 50%" },
      { name: "6 Months", value: "6months", duration: 6, price: 999, originalPrice: 1998, savings: "Save 50%" },
    ];
  }
  return [
    { name: "1 Month", value: "1month", duration: 1, price: 99, originalPrice: 198, savings: "Save 50%" },
    { name: "3 Months", value: "3months", duration: 3, price: 199, originalPrice: 398, savings: "Save 50%" },
    { name: "6 Months", value: "6months", duration: 6, price: 299, originalPrice: 598, savings: "Save 50%" },
  ];
}

export function resolveMembershipPlan(
  categoryRaw: string | undefined,
  planValue: string
): ListingPlan | null {
  const v = (planValue ?? "").trim().toLowerCase();
  const plans = getMembershipPlansForCategory(categoryRaw);
  return plans.find((p) => p.value.toLowerCase() === v) ?? null;
}
