"use client";
import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (place: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    lat: number;
    lng: number;
  }) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelected,
  placeholder = "Search for a location...",
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      initAutocomplete();
      return;
    }

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
      initAutocomplete();
    };

    script.onerror = () => {
      console.error("Failed to load Google Maps script");
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    try {
      // Initialize autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "in" }, // Restrict to India
          fields: ["address_components", "formatted_address", "geometry"],
          types: ["geocode", "establishment"], // Allow both addresses and places
        }
      );

      // Add place changed listener
      autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
    }
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    
    if (!place || !place.address_components) {
      console.log("No place details available");
      return;
    }

    // Extract address components
    let address = "";
    let city = "";
    let state = "";
    let pincode = "";

    place.address_components.forEach((component: any) => {
      const types = component.types;

      if (types.includes("street_number") || types.includes("route")) {
        address += component.long_name + " ";
      }
      if (types.includes("sublocality_level_1") || types.includes("sublocality")) {
        address += component.long_name + " ";
      }
      if (types.includes("locality")) {
        city = component.long_name;
      }
      if (types.includes("administrative_area_level_1")) {
        state = component.long_name;
      }
      if (types.includes("postal_code")) {
        pincode = component.long_name;
      }
    });

    // If no specific address found, use the formatted address
    if (!address.trim()) {
      address = place.formatted_address || "";
    }

    // Get lat/lng from geometry
    const lat = place.geometry?.location?.lat() || 0;
    const lng = place.geometry?.location?.lng() || 0;

    const placeData = {
      address: address.trim(),
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      fullAddress: place.formatted_address || "",
      lat,
      lng,
    };

    console.log("Selected place:", placeData);

    // Update parent component
    onChange(place.formatted_address || "");
    onPlaceSelected(placeData);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <MapPin className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${className}`}
          autoComplete="off"
        />
      </div>
      
      {!isLoaded && (
        <p className="text-xs text-gray-500 mt-1">Loading location services...</p>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;
