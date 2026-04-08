"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, ChevronDown, Loader2, Navigation } from "lucide-react";
import { toast } from "sonner";
import GooglePlacesAutocomplete from "@/components/Form/GooglePlacesAutocomplete";
import { useUserLocation } from "@/context/LocationContext";
import type { ParsedPlace } from "@/utilis/parseGooglePlace";

export default function NavbarLocationPicker({ variant = "desktop" }: { variant?: "desktop" | "sidebar" }) {
  const { location, label, setLocation, detectCurrentLocation, detecting } =
    useUserLocation();
  const [open, setOpen] = useState(false);
  const addrLine = location?.formattedAddress || location?.fullAddress || "";
  const [inputValue, setInputValue] = useState(addrLine);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(location?.formattedAddress || location?.fullAddress || "");
  }, [location?.formattedAddress, location?.fullAddress]);

  useEffect(() => {
    if (!open || variant !== "desktop") return;
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // Google Places suggestions render in .pac-container on <body>
      if (target.closest(".pac-container")) return;
      if (wrapRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open, variant]);

  const onPlaceSelected = (place: ParsedPlace) => {
    setLocation(place);
    setInputValue(place.fullAddress);
    setOpen(false);
    toast.success(`Location set to ${place.city ? `${place.city}, ${place.state}` : place.fullAddress}`);
  };

  const handleUseLocation = async () => {
    const ok = await detectCurrentLocation();
    if (ok) {
      setOpen(false);
      toast.success("Location updated from your device");
    } else {
      toast.error("Could not detect location. Try searching instead.");
    }
  };

  const display = label || "City, State";

  if (variant === "sidebar") {
    return (
      <div className="mb-6 pb-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Your location
        </p>
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium text-gray-800 line-clamp-2">{display}</span>
        </div>
        <GooglePlacesAutocomplete
          hideIcon
          value={inputValue}
          onChange={setInputValue}
          onPlaceSelected={onPlaceSelected}
          placeholder="Search city or area…"
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          type="button"
          onClick={() => void handleUseLocation()}
          disabled={detecting}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-60"
        >
          {detecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          Use current location
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative min-w-0 max-w-[100%] location-dropdown">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 min-w-0 max-w-full py-1.5 px-2 rounded-xl hover:bg-blue-50/80 transition-colors text-left border border-transparent hover:border-blue-100"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate min-w-0">
          {display}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-[min(100vw-2rem,22rem)] z-[70] bg-white rounded-xl shadow-xl border border-gray-200 p-3">
          <p className="text-xs text-gray-500 mb-2">Search or use your current location</p>
          <GooglePlacesAutocomplete
            hideIcon
            value={inputValue}
            onChange={setInputValue}
            onPlaceSelected={onPlaceSelected}
            placeholder="Search city, state…"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={() => void handleUseLocation()}
            disabled={detecting}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-60"
          >
            {detecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            Use current location
          </button>
        </div>
      )}
    </div>
  );
}
