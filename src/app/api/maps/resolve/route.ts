import { NextRequest, NextResponse } from "next/server";
import { parseAddressComponents } from "@/utilis/parseGooglePlace";

export const dynamic = "force-dynamic";

function isProbablyGoogleMapsUrl(raw: string): boolean {
  const s = raw.toLowerCase();
  return (
    s.includes("maps.app.goo.gl/") ||
    s.includes("google.com/maps") ||
    s.includes("goo.gl/maps") ||
    s.includes("maps.google.com")
  );
}

function extractLatLngFromUrl(u: URL): { lat: number; lng: number } | null {
  // Common patterns:
  // - .../@26.9124,75.7873,17z
  // - ...?q=26.9124,75.7873
  const at = u.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (at) return { lat: Number(at[1]), lng: Number(at[2]) };
  const q = u.searchParams.get("q") || u.searchParams.get("query");
  if (q) {
    const m = q.match(/(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
    if (m) return { lat: Number(m[1]), lng: Number(m[2]) };
  }
  return null;
}

function tryExtractCidFromFtid(u: URL): string | null {
  const ftid = u.searchParams.get("ftid");
  if (!ftid) return null;
  // format: 0x....:0x....
  const m = ftid.match(/^0x[0-9a-fA-F]+:0x([0-9a-fA-F]+)$/);
  if (!m) return null;
  try {
    const cid = BigInt("0x" + m[1]).toString(10);
    return cid;
  } catch {
    return null;
  }
}

async function tryFindPlaceFromText(params: {
  apiKey: string;
  input: string;
}): Promise<
  | {
      formatted_address: string;
      address_components: any[];
      lat: number;
      lng: number;
    }
  | null
> {
  // Prefer Places "find place from text" when URL doesn't include coordinates.
  // This typically matches the exact POI that Google Maps shows.
  const url =
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json" +
    `?input=${encodeURIComponent(params.input)}` +
    `&inputtype=textquery` +
    `&fields=${encodeURIComponent("formatted_address,geometry,address_components")}` +
    `&key=${encodeURIComponent(params.apiKey)}`;

  const res = await fetch(url, { method: "GET" });
  const json = await res.json();
  if (!res.ok) return null;
  if (json.status !== "OK" || !json.candidates?.[0]) return null;

  const c0 = json.candidates[0];
  const lat = c0.geometry?.location?.lat;
  const lng = c0.geometry?.location?.lng;
  if (typeof lat !== "number" || typeof lng !== "number") return null;

  return {
    formatted_address: c0.formatted_address || "",
    address_components: c0.address_components || [],
    lat,
    lng,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { url } = (await req.json()) as { url?: string };
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, message: "url is required" },
        { status: 400 }
      );
    }

    const raw = url.trim();
    if (!isProbablyGoogleMapsUrl(raw)) {
      return NextResponse.json(
        { success: false, message: "Not a Google Maps URL" },
        { status: 400 }
      );
    }

    // 1) Expand short links / follow redirects server-side
    const expanded = await fetch(raw, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (VRental)" },
    });

    const finalUrl = expanded.url || raw;
    const final = new URL(finalUrl);

    // 2) Try to extract lat/lng from URL first (fast path)
    let coords = extractLatLngFromUrl(final);

    // 3) If not found, try to use a query parameter (place name / address) and geocode it
    // Prefer a server-only key if available (recommended). Fallback to NEXT_PUBLIC key.
    const apiKey =
      process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing GOOGLE_MAPS_SERVER_KEY (recommended) or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
        },
        { status: 500 }
      );
    }

    // Try common params that contain the address / place text
    const q =
      final.searchParams.get("q") ||
      final.searchParams.get("query") ||
      final.searchParams.get("destination") ||
      "";

    // If we have ftid, we can often resolve exact POI via cid redirect → URL with @lat,lng
    if (!coords) {
      const cid = tryExtractCidFromFtid(final);
      if (cid) {
        const cidRes = await fetch(`https://www.google.com/maps?cid=${cid}`, {
          method: "GET",
          redirect: "follow",
          headers: { "user-agent": "Mozilla/5.0 (VRental)" },
        });
        const cidFinalUrl = cidRes.url;
        if (cidFinalUrl) {
          const cidFinal = new URL(cidFinalUrl);
          coords = extractLatLngFromUrl(cidFinal) || coords;
        }
      }
    }

    // If URL doesn't have coords, prefer Places Find Place From Text for more accurate POI resolution
    let used: "url_coords" | "cid_coords" | "places_find" | "geocode" = coords
      ? "url_coords"
      : "geocode";

    if (!coords && q) {
      const found = await tryFindPlaceFromText({ apiKey, input: q });
      if (found) {
        used = "places_find";
        const parsed = parseAddressComponents(
          found.address_components || [],
          found.formatted_address || "",
          found.lat,
          found.lng
        );
        return NextResponse.json(
          { success: true, message: "Resolved", data: parsed, finalUrl, used },
          { status: 200 }
        );
      }
    }

    // Fallback to Geocoding API
    let geocodeUrl: string | null = null;
    if (coords) {
      geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${apiKey}`;
    } else if (q) {
      geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        q
      )}&key=${apiKey}`;
    }

    if (!geocodeUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Could not parse location from the Google Maps link. Please open it and share the full maps.google.com URL.",
          finalUrl,
        },
        { status: 400 }
      );
    }

    used = "geocode";
    const geoRes = await fetch(geocodeUrl, { method: "GET" });
    const geo = await geoRes.json();
    if (!geoRes.ok || geo.status !== "OK" || !geo.results?.[0]) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to resolve Google Maps link",
          finalUrl,
          geocodeStatus: geo.status,
          geocodeErrorMessage: geo.error_message,
        },
        { status: 400 }
      );
    }

    const r0 = geo.results[0];
    const lat = r0.geometry?.location?.lat ?? coords?.lat ?? 0;
    const lng = r0.geometry?.location?.lng ?? coords?.lng ?? 0;

    const parsed = parseAddressComponents(
      r0.address_components || [],
      r0.formatted_address || "",
      lat,
      lng
    );

    return NextResponse.json(
      { success: true, message: "Resolved", data: parsed, finalUrl, used },
      { status: 200 }
    );
  } catch (e) {
    console.error("Resolve maps url error:", e);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

