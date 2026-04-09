/** Earth radius in km */
const R = 6371;

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export type ListingWithCoords = {
  location: string;
  coordinates?: { latitude?: number; longitude?: number };
};

/**
 * Keep listings near `center` within `radiusKm`, or whose address text mentions
 * the same city/state (navbar selection) for edge cases slightly outside the circle.
 */
export function filterListingsNearArea<T extends ListingWithCoords>(
  listings: T[],
  center: { lat: number; lng: number },
  radiusKm: number,
  cityHint?: string,
  stateHint?: string
): T[] {
  const city = (cityHint || "").trim().toLowerCase();
  const state = (stateHint || "").trim().toLowerCase();

  return listings.filter((apt) => {
    const lat = Number(apt.coordinates?.latitude);
    const lng = Number(apt.coordinates?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;

    const d = haversineKm(center.lat, center.lng, lat, lng);
    if (d <= radiusKm) return true;

    const loc = (apt.location || "").toLowerCase();
    if (city.length >= 2 && loc.includes(city)) return true;
    if (state.length >= 3 && loc.includes(state)) return true;

    return false;
  });
}
