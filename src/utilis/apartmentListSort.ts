/** Lower = earlier on category/home lists. Missing field treated as large default. */
export const DEFAULT_CATEGORY_ORDER = 1_000_000;

export function getCategoryFeaturedOrder(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : DEFAULT_CATEGORY_ORDER; // same as schema default
}

export function sortApartmentsForPublicList<
  T extends { categoryFeaturedOrder?: number; averageRating?: number; _id?: string },
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const oa = getCategoryFeaturedOrder(a.categoryFeaturedOrder);
    const ob = getCategoryFeaturedOrder(b.categoryFeaturedOrder);
    if (oa !== ob) return oa - ob;
    const ra = a.averageRating ?? 0;
    const rb = b.averageRating ?? 0;
    if (rb !== ra) return rb - ra;
    return String(b._id ?? "").localeCompare(String(a._id ?? ""));
  });
}
