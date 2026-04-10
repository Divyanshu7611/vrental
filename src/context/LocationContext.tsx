"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadGoogleMapsPlaces } from "@/lib/loadGoogleMapsPlaces";
import { parseAddressComponents, type ParsedPlace } from "@/utilis/parseGooglePlace";

const STORAGE_KEY = "vrental_user_location";

export type UserLocation = ParsedPlace;

type LocationContextType = {
  location: UserLocation | null;
  label: string;
  ready: boolean;
  setLocation: (place: UserLocation) => void;
  clearLocation: () => void;
  detectCurrentLocation: () => Promise<boolean>;
  detecting: boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

/** Normalize anything saved in localStorage (fullAddress vs formattedAddress). */
function normalizeLocation(p: UserLocation | null | undefined): UserLocation | null {
  if (!p || typeof p.lat !== "number" || typeof p.lng !== "number") return null;
  const addr = (p.fullAddress || p.formattedAddress || "").trim();
  if (!addr) return null;
  return {
    ...p,
    fullAddress: addr,
    formattedAddress: addr,
  };
}

function loadStored(): UserLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as UserLocation;
    return normalizeLocation(p);
  } catch {
    /* ignore */
  }
  return null;
}

function buildLabel(p: UserLocation | null): string {
  if (!p) return "";
  if (p.city && p.state) return `${p.city}, ${p.state}`;
  if (p.city) return p.city;
  if (p.state) return p.state;
  const line = p.formattedAddress || p.fullAddress;
  if (line) {
    const parts = line.split(",").map((s) => s.trim());
    return parts.slice(0, 2).join(", ") || line;
  }
  return "";
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<UserLocation | null>(null);
  const [ready, setReady] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const setLocation = useCallback((place: UserLocation) => {
    const next = normalizeLocation(place);
    if (!next) return;
    setLocationState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const stored = loadStored();
    setLocationState(stored);
    setReady(true);

    if (stored || typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void (async () => {
          try {
            // User may have set a place (e.g. map/menu) while GPS was resolving
            if (loadStored()) return;

            await loadGoogleMapsPlaces();
            if (loadStored()) return;

            const maps = (window as { google?: { maps: unknown } }).google
              ?.maps as {
              Geocoder: new () => {
                geocode: (
                  req: { location: { lat: number; lng: number } },
                  cb: (
                    results: Array<{
                      formatted_address: string;
                      address_components: Array<{
                        long_name: string;
                        short_name: string;
                        types: string[];
                      }>;
                    }> | null,
                    status: string
                  ) => void
                ) => void;
              };
            };
            const geocoder = new maps.Geocoder();
            geocoder.geocode(
              {
                location: {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                },
              },
              (results, status) => {
                if (loadStored()) return;
                if (status !== "OK" || !results?.[0]) return;
                const r = results[0];
                const parsed = parseAddressComponents(
                  r.address_components,
                  r.formatted_address,
                  pos.coords.latitude,
                  pos.coords.longitude
                );
                if (!parsed.city && !parsed.state) return;
                const normalized = normalizeLocation(parsed);
                if (!normalized) return;
                setLocationState(normalized);
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
                } catch {
                  /* ignore */
                }
              }
            );
          } catch {
            /* maps failed */
          }
        })();
      },
      () => {},
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setLocationState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const detectCurrentLocation = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return false;
    setDetecting(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });
      await loadGoogleMapsPlaces();
      const maps = (window as { google?: { maps: unknown } }).google?.maps as {
        Geocoder: new () => {
          geocode: (
            req: { location: { lat: number; lng: number } },
            cb: (
              results: Array<{
                formatted_address: string;
                address_components: Array<{
                  long_name: string;
                  short_name: string;
                  types: string[];
                }>;
              }> | null,
              status: string
            ) => void
          ) => void;
        };
      };
      const geocoder = new maps.Geocoder();
      await new Promise<void>((resolve, reject) => {
        geocoder.geocode(
          {
            location: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            },
          },
          (results, status) => {
            if (status !== "OK" || !results?.[0]) {
              reject(new Error("Geocode failed"));
              return;
            }
            const r = results[0];
            const parsed = parseAddressComponents(
              r.address_components,
              r.formatted_address,
              pos.coords.latitude,
              pos.coords.longitude
            );
            setLocation(parsed);
            resolve();
          }
        );
      });
      return true;
    } catch {
      return false;
    } finally {
      setDetecting(false);
    }
  }, [setLocation]);

  const label = useMemo(() => buildLabel(location), [location]);

  const value = useMemo(
    () => ({
      location,
      label,
      ready,
      setLocation,
      clearLocation,
      detectCurrentLocation,
      detecting,
    }),
    [location, label, ready, setLocation, clearLocation, detectCurrentLocation, detecting]
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}

export function useUserLocation(): LocationContextType {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useUserLocation must be used within LocationProvider");
  }
  return ctx;
}
