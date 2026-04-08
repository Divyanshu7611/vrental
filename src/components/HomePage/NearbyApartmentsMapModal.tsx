"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, Loader2, Navigation } from "lucide-react";
import axios from "axios";
import { useUserLocation, type UserLocation } from "@/context/LocationContext";
import { filterListingsNearArea } from "@/utilis/listingAreaFilter";

/** ~100 km covers most metro areas; listings can also match navbar city/state in address text */
const NEARBY_RADIUS_KM = 100;

export interface MapListing {
  _id: string;
  apartmentName: string;
  location: string;
  price: number;
  category: string;
  image_urls: string[];
  averageRating: number;
  coordinates: { latitude: number; longitude: number };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("No window"));
      return;
    }
    const w = window as Window & { google?: { maps: unknown } };
    if (w.google?.maps) {
      resolve();
      return;
    }
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"));
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="maps.googleapis.com"]'
    );
    if (existing) {
      const t = setInterval(() => {
        const win = window as Window & { google?: { maps: unknown } };
        if (win.google?.maps) {
          clearInterval(t);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(t);
        const win = window as Window & { google?: { maps: unknown } };
        if (win.google?.maps) resolve();
        else reject(new Error("Google Maps load timeout"));
      }, 20000);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const t = setInterval(() => {
        const win = window as Window & { google?: { maps: unknown } };
        if (win.google?.maps) {
          clearInterval(t);
          resolve();
        }
      }, 30);
      setTimeout(() => {
        clearInterval(t);
        const win = window as Window & { google?: { maps: unknown } };
        if (win.google?.maps) resolve();
        else reject(new Error("Google Maps API not available after load"));
      }, 15000);
    };
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

/** Minimal typing for google.maps.Map instance */
type GoogleMapInstance = {
  fitBounds: (bounds: unknown, padding?: unknown) => void;
  setCenter: (p: { lat: number; lng: number }) => void;
  setZoom: (z: number) => void;
};

interface NearbyApartmentsMapModalProps {
  open: boolean;
  onClose: () => void;
}

function hasValidCoords(lat: number | undefined, lng: number | undefined): boolean {
  const a = Number(lat);
  const b = Number(lng);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  if (a === 0 && b === 0) return false;
  return Math.abs(a) <= 90 && Math.abs(b) <= 180;
}

/** Build API query params so Kota listings load even if city was only parsed into the label string */
function mapListingsParams(sl: UserLocation | null, label: string): Record<string, string> {
  const params: Record<string, string> = {};
  const lab = (label || "").trim();
  const cityFromLabel = lab.split(",")[0]?.trim() || "";
  const stateFromLabel = lab.split(",")[1]?.trim() || "";

  const city = (sl?.city?.trim() && sl.city.trim().length >= 2
    ? sl.city.trim()
    : cityFromLabel.length >= 2
      ? cityFromLabel
      : "") || "";

  const state = (sl?.state?.trim() && sl.state.trim().length >= 2
    ? sl.state.trim()
    : stateFromLabel.length >= 2
      ? stateFromLabel
      : "") || "";

  if (city) params.city = city;
  if (state) params.state = state;
  return params;
}

export default function NearbyApartmentsMapModal({
  open,
  onClose,
}: NearbyApartmentsMapModalProps) {
  const { location: savedLocation, label: savedLabel } = useUserLocation();
  const savedLocRef = useRef(savedLocation);
  const savedLabelRef = useRef(savedLabel);
  savedLocRef.current = savedLocation;
  savedLabelRef.current = savedLabel;

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GoogleMapInstance | null>(null);
  const markersRef = useRef<Array<{ setMap: (m: unknown) => void }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<MapListing[]>([]);
  /** Total listings returned by API (before nearby filter) */
  const [totalWithPins, setTotalWithPins] = useState(0);
  const [userLabel, setUserLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setUserLabel(null);
    setTotalWithPins(0);

    const run = async () => {
      try {
        const listParams = mapListingsParams(
          savedLocRef.current,
          savedLabelRef.current || ""
        );

        const [, res] = await Promise.all([
          loadGoogleMaps(),
          axios.get<{
            data: MapListing[];
            success?: boolean;
            scopedByArea?: boolean;
          }>("/api/aparment/mapListings", { params: listParams }),
        ]);
        if (cancelled) return;

        const data = res.data?.data ?? [];
        const serverAreaScoped = res.data?.scopedByArea === true;

        const gmaps = (window as { google?: { maps: unknown } }).google
          ?.maps as Record<string, unknown>;
        if (!mapRef.current || !gmaps || typeof gmaps.Map !== "function") {
          throw new Error("Map container not ready");
        }

        const GeocoderCtor = gmaps.Geocoder as new () => {
          geocode: (
            req: { address?: string; location?: { lat: number; lng: number } },
            cb: (
              results: Array<{ geometry: { location: { lat: () => number; lng: () => number } } }> | null,
              status: string
            ) => void
          ) => void;
        };

        const geocodeAddress = (address: string): Promise<{ lat: number; lng: number } | null> => {
          return new Promise((resolve) => {
            try {
              const geocoder = new GeocoderCtor();
              geocoder.geocode({ address }, (results, status) => {
                if (status !== "OK" || !results?.[0]?.geometry?.location) {
                  resolve(null);
                  return;
                }
                const loc = results[0].geometry.location;
                resolve({ lat: loc.lat(), lng: loc.lng() });
              });
            } catch {
              resolve(null);
            }
          });
        };

        /** Priority: navbar saved lat/lng → device GPS → geocode city/state → saved address */
        const resolveAnchor = async (): Promise<{
          pos: { lat: number; lng: number } | null;
          message: string;
        }> => {
          const sl = savedLocRef.current;
          const navLabel = savedLabelRef.current;
          if (sl && hasValidCoords(sl.lat, sl.lng)) {
            return {
              pos: { lat: sl.lat, lng: sl.lng },
              message: navLabel
                ? `Area: ${navLabel} (from navbar). Blue pin = your location; map pins = listings in this region.`
                : `Blue pin = your saved navbar location. Other pins = nearby listings.`,
            };
          }

          const gpsPos = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) =>
                resolve({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                }),
              () => resolve(null),
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
            );
          });

          if (gpsPos) {
            return {
              pos: gpsPos,
              message:
                "Using device location (blue pin). Set city & state in the navbar to filter listings to that area.",
            };
          }

          if (sl?.city && sl?.state) {
            const g = await geocodeAddress(`${sl.city}, ${sl.state}, India`);
            if (g) {
              return {
                pos: g,
                message: `Area: ${sl.city}, ${sl.state}. Showing listing pins near this region.`,
              };
            }
          }

          const savedAddr = sl?.formattedAddress?.trim() || sl?.fullAddress?.trim();
          if (savedAddr) {
            const g = await geocodeAddress(savedAddr);
            if (g) {
              return {
                pos: g,
                message: "Using your saved address from the navbar to find nearby listing pins.",
              };
            }
          }

          return {
            pos: null,
            message:
              "Set your location in the navbar to show only nearby listings. Showing all pins across India.",
          };
        };

        const { pos: anchorPos, message: anchorMessage } = await resolveAnchor();
        if (cancelled) return;

        const sl = savedLocRef.current;
        const navLabel = savedLabelRef.current;

        let plotListings = data;
        let filterNote = "";

        const areaDesc =
          navLabel || [sl?.city, sl?.state].filter(Boolean).join(", ") || "your area";

        if (data.length > 0) {
          if (serverAreaScoped) {
            // Server already returned listings whose address matches navbar city/state
            plotListings = data;
            filterNote = ` Showing ${plotListings.length} with map pins whose address includes ${areaDesc}.`;
          } else if (anchorPos) {
            plotListings = filterListingsNearArea(
              data,
              anchorPos,
              NEARBY_RADIUS_KM,
              sl?.city,
              sl?.state
            );
            if (plotListings.length === 0) {
              filterNote = ` No listings with map pins within ~${NEARBY_RADIUS_KM} km of ${areaDesc} (or whose address includes that city/state) in this dataset. Set city in the navbar to load that area from the server.`;
            } else {
              filterNote = ` Showing ${plotListings.length} near ${areaDesc} (within ~${NEARBY_RADIUS_KM} km or matching city/state in the listing address).`;
            }
          } else {
            plotListings = data;
            filterNote = ` Showing all ${data.length} listing(s) with pins — set your city in the navbar to load that area.`;
          }
        }

        setTotalWithPins(data.length);
        setListings(plotListings);
        setUserLabel(anchorMessage + filterNote);

        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        const defaultCenter = { lat: 20.5937, lng: 78.9629 };

        const MapCtor = gmaps.Map as new (el: HTMLElement, opts: object) => GoogleMapInstance;
        const map = new MapCtor(mapRef.current, {
          center: defaultCenter,
          zoom: 5,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });
        mapInstanceRef.current = map;

        const LatLngBounds = gmaps.LatLngBounds as new () => {
          extend: (p: { lat: number; lng: number }) => void;
        };
        const InfoWindow = gmaps.InfoWindow as new (opts: object) => {
          setContent: (html: string) => void;
          open: (mapInst: GoogleMapInstance, marker: unknown) => void;
        };
        const Marker = gmaps.Marker as new (opts: object) => {
          setMap: (m: unknown) => void;
          addListener: (ev: string, fn: () => void) => void;
        };

        const bounds = new LatLngBounds();
        const infoWindow = new InfoWindow({});

        plotListings.forEach((apt) => {
          const lat = Number(apt.coordinates?.latitude);
          const lng = Number(apt.coordinates?.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

          const pos = { lat, lng };
          const marker = new Marker({
            position: pos,
            map,
            title: apt.apartmentName,
            animation: (gmaps.Animation as { DROP: unknown }).DROP,
          });
          markersRef.current.push(marker);
          bounds.extend(pos);

          const detailUrl = `/apartment?apartmentID=${apt._id}`;
          const rawImg = apt.image_urls?.[0];
          const img =
            rawImg &&
            /^https?:\/\//i.test(rawImg) &&
            `<img src="${escapeHtml(rawImg)}" alt="" style="width:100%;max-height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />`;

          marker.addListener("click", () => {
            infoWindow.setContent(`
              <div style="padding:8px;max-width:260px;font-family:system-ui,sans-serif;">
                ${img || ""}
                <strong style="font-size:14px;color:#111;">${escapeHtml(apt.apartmentName)}</strong>
                <p style="margin:4px 0;font-size:12px;color:#555;">${escapeHtml(apt.category)} · ₹${apt.price}/mo</p>
                <p style="margin:4px 0;font-size:11px;color:#666;">${escapeHtml(apt.location)}</p>
                <a href="${detailUrl}" style="display:inline-block;margin-top:8px;color:#2563eb;font-size:13px;font-weight:600;">View listing →</a>
              </div>
            `);
            infoWindow.open(map, marker);
          });
        });

        const padding = { top: 48, right: 48, bottom: 48, left: 48 };

        const applyView = (anchor: { lat: number; lng: number } | null) => {
          if (cancelled || !mapInstanceRef.current) return;
          const m = mapInstanceRef.current;

          if (anchor) {
            new Marker({
              position: anchor,
              map: m,
              title: "Your selected area",
              icon: {
                path: (gmaps.SymbolPath as { CIRCLE: unknown }).CIRCLE,
                scale: 10,
                fillColor: "#2563eb",
                fillOpacity: 1,
                strokeColor: "#fff",
                strokeWeight: 2,
              },
            });
            bounds.extend(anchor);
          }

          const hasPins = plotListings.length > 0;
          if (hasPins) {
            m.fitBounds(bounds, padding);
          } else if (anchor) {
            m.setCenter(anchor);
            m.setZoom(11);
          } else {
            m.setCenter(defaultCenter);
            m.setZoom(5);
          }
          setLoading(false);
        };

        if (data.length === 0) {
          setError(
            "No listings with map pins yet. Properties need a saved map location to appear here."
          );
        }

        applyView(anchorPos);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Could not load the map. Check your API key."
          );
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      mapInstanceRef.current = null;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  /** Portal to body so z-index is not trapped under Hero (relative z-10) below the navbar (z-50). */
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nearby-map-title"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl max-h-[min(100dvh,100svh)] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden sm:my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-2 sm:gap-3 sm:justify-between px-3 pt-3 pb-2 sm:px-5 sm:py-3 border-b border-gray-100 shrink-0">
          <div className="min-w-0 flex-1 order-2 sm:order-1 pt-0.5 sm:pt-0">
            <h2
              id="nearby-map-title"
              className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2 leading-tight"
            >
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
              <span className="line-clamp-2">Nearby registered apartments</span>
            </h2>
            <p className="text-[11px] sm:text-sm text-gray-600 mt-1 flex items-start gap-1.5">
              <Navigation className="w-3.5 h-3.5 mt-0.5 shrink-0 text-cyan-600" />
              <span>
                Pins match your{" "}
                <strong className="text-gray-800">navbar location</strong> (~{NEARBY_RADIUS_KM}{" "}
                km or same city/state in the listing). Update the top bar to change area.
              </span>
            </p>
            {userLabel && (
              <p className="text-xs text-blue-700 mt-2 font-medium line-clamp-3">{userLabel}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="order-1 sm:order-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 transition-colors sm:h-10 sm:w-10"
            aria-label="Close map"
          >
            <X className="w-6 h-6" strokeWidth={2.25} />
          </button>
        </div>

        <div className="relative flex-1 min-h-[min(55vh,420px)] sm:min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Loading map & listings…</p>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full min-h-[min(55vh,420px)] sm:min-h-[400px]" />
        </div>

        <div className="px-4 py-3 sm:px-5 border-t border-gray-100 bg-gray-50 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3">
          <button
            type="button"
            onClick={onClose}
            className="sm:hidden w-full mb-3 min-h-12 rounded-xl bg-slate-800 text-white text-sm font-semibold active:bg-slate-900 transition-colors"
          >
            Close map
          </button>
          <p className="text-sm text-gray-700">
            {totalWithPins > 0 && listings.length !== totalWithPins ? (
              <>
                <span className="font-semibold">{listings.length}</span> near your selected area
                <span className="text-gray-500">
                  {" "}
                  · {totalWithPins} total with map pins nationwide
                </span>
              </>
            ) : (
              <>
                <span className="font-semibold">{listings.length}</span>
                {listings.length === 1 ? " property" : " properties"}
                {totalWithPins > 0 ? " on the map" : " with map locations"}
              </>
            )}
          </p>
          {error && (
            <p className="text-xs text-amber-800 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
