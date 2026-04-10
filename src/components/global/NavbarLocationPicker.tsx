"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, ChevronDown, Loader2, Navigation, Map } from "lucide-react";
import { toast } from "sonner";
import GooglePlacesAutocomplete from "@/components/Form/GooglePlacesAutocomplete";
import { useUserLocation } from "@/context/LocationContext";
import type { ParsedPlace } from "@/utilis/parseGooglePlace";

export default function NavbarLocationPicker({
  variant = "desktop",
  dropdownAlign = "left",
  onShowNearbyMap,
}: {
  variant?: "desktop" | "sidebar" | "modal" | "hero";
  /** When the trigger sits on the right side of the navbar, align the panel to the right. */
  dropdownAlign?: "left" | "right";
  /** Hero only: opens the nearby listings map (shown as a compact button on mobile). */
  onShowNearbyMap?: () => void;
}) {
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

  if (variant === "sidebar" || variant === "modal" || variant === "hero") {
    const wrapClass =
      variant === "sidebar"
        ? "mb-6 pb-4 border-b border-gray-100"
        : variant === "hero"
          ? "w-full rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm p-3 sm:p-4"
          : "mt-3 rounded-xl border border-gray-200 bg-gray-50/90 p-3 sm:p-4";
    const title =
      variant === "sidebar"
        ? "Your location"
        : variant === "hero"
          ? "Select your area"
          : "Update your area";
    return (
      <div className={wrapClass}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {title}
        </p>
        <div className="mb-2 flex items-center gap-2 text-black">
          <MapPin className="h-4 w-4 shrink-0" strokeWidth={2.25} />
          <span className="text-sm font-medium text-gray-900 line-clamp-2">{display}</span>
        </div>
        <GooglePlacesAutocomplete
          hideIcon
          value={inputValue}
          onChange={setInputValue}
          onPlaceSelected={onPlaceSelected}
          placeholder="Search city or area…"
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        />
        <button
          type="button"
          onClick={() => void handleUseLocation()}
          disabled={detecting}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 disabled:opacity-60"
        >
          {detecting ? (
            <Loader2 className="h-4 w-4 animate-spin text-black" />
          ) : (
            <Navigation className="h-4 w-4 text-black" strokeWidth={2.25} />
          )}
          Use current location
        </button>
        {variant === "hero" && onShowNearbyMap ? (
          <button
            type="button"
            onClick={onShowNearbyMap}
            className="md:hidden mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:scale-[0.99]"
          >
            <Map className="h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden />
            Show listings on map
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative min-w-0 max-w-[100%] location-dropdown">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 min-w-0 max-w-full py-1.5 px-2 rounded-xl hover:bg-gray-100 transition-colors text-left border border-transparent hover:border-gray-200"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <MapPin className="w-4 h-4 shrink-0 text-black" strokeWidth={2.25} />
        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate min-w-0">
          {display}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-black transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2.25}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 w-[min(100vw-2rem,22rem)] z-[70] bg-white rounded-xl shadow-xl border border-gray-200 p-3 ${
            dropdownAlign === "right" ? "right-0 left-auto" : "left-0"
          }`}
        >
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
