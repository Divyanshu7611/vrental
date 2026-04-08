"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin } from "lucide-react";
import { loadGoogleMapsPlaces } from "@/lib/loadGoogleMapsPlaces";
import { parseAddressComponents, type ParsedPlace } from "@/utilis/parseGooglePlace";

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (place: ParsedPlace) => void;
  placeholder?: string;
  className?: string;
  /** When true, only the input is rendered (use an external icon in the parent). */
  hideIcon?: boolean;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelected,
  placeholder = "Search for a location...",
  className = "",
  hideIcon = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<{ getPlace: () => unknown; addListener: (e: string, fn: () => void) => void } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const onPlaceSelectedRef = useRef(onPlaceSelected);
  const onChangeRef = useRef(onChange);
  onPlaceSelectedRef.current = onPlaceSelected;
  onChangeRef.current = onChange;

  const handlePlaceSelect = useCallback(() => {
    const ac = autocompleteRef.current as {
      getPlace: () => {
        address_components?: Array<{
          long_name: string;
          short_name: string;
          types: string[];
        }>;
        formatted_address?: string;
        geometry?: { location: { lat: () => number; lng: () => number } };
      };
    };
    const place = ac?.getPlace?.();

    if (!place || !place.address_components) {
      return;
    }

    const lat = place.geometry?.location?.lat() ?? 0;
    const lng = place.geometry?.location?.lng() ?? 0;

    const placeData = parseAddressComponents(
      place.address_components,
      place.formatted_address || "",
      lat,
      lng
    );

    onChangeRef.current(place.formatted_address || "");
    onPlaceSelectedRef.current(placeData);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        await loadGoogleMapsPlaces();
        const places = (window as { google?: { maps?: { places?: unknown } } }).google
          ?.maps?.places as {
          Autocomplete: new (el: HTMLInputElement, opts: object) => {
            addListener: (ev: string, fn: () => void) => void;
          };
        };
        if (cancelled || !inputRef.current || !places) return;
        setIsLoaded(true);

        try {
          autocompleteRef.current = new places.Autocomplete(
            inputRef.current,
            {
              componentRestrictions: { country: "in" },
              fields: ["address_components", "formatted_address", "geometry"],
              types: ["geocode", "establishment"],
            }
          );

          autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
        } catch (error) {
          console.error("Error initializing autocomplete:", error);
        }
      } catch (e) {
        console.error(e);
      }
    };

    void boot();

    return () => {
      cancelled = true;
      const ev = (window as { google?: { maps?: { event?: { clearInstanceListeners: (o: unknown) => void } } } })
        .google?.maps?.event;
      if (autocompleteRef.current && ev) {
        try {
          ev.clearInstanceListeners(autocompleteRef.current);
        } catch {
          /* ignore */
        }
      }
    };
  }, [handlePlaceSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeRef.current(e.target.value);
  };

  return (
    <div className="relative w-full min-w-0">
      {!hideIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-[1]">
          <MapPin className="w-5 h-5" />
        </div>
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={
          hideIcon
            ? className
            : `w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${className}`
        }
        autoComplete="off"
      />

      {!isLoaded && !hideIcon && (
        <p className="text-xs text-gray-500 mt-1">Loading location services…</p>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;
