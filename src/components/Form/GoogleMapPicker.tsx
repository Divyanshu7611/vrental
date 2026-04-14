"use client";
import React, { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface GoogleMapPickerProps {
  onLocationSelect: (location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  }) => void;
  initialLat?: number;
  initialLng?: number;
  externalLat?: number;
  externalLng?: number;
  /** If true, auto-center on user's current location (when no initial coords provided). */
  autoUseCurrentLocation?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleMapPicker: React.FC<GoogleMapPickerProps> = ({
  onLocationSelect,
  initialLat,
  initialLng,
  externalLat,
  externalLng,
  autoUseCurrentLocation = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [booted, setBooted] = useState(false);

  // Effect to update map when external coordinates change (from autocomplete)
  useEffect(() => {
    if (map && marker && externalLat && externalLng) {
      const newPosition = { lat: externalLat, lng: externalLng };
      map.setCenter(newPosition);
      map.setZoom(15);
      marker.setPosition(newPosition);
      getAddressFromLatLng(externalLat, externalLng);
    }
  }, [externalLat, externalLng, map, marker]);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      void bootMap();
      return;
    }

    // Load Google Maps script if not already loaded
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com"]`
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setIsLoaded(true);
        void bootMap();
      };

      script.onerror = () => {
        console.error("Failed to load Google Maps script");
      };

      document.head.appendChild(script);
    } else {
      // Script exists, wait for it to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          setIsLoaded(true);
          void bootMap();
        }
      }, 100);
    }
  }, []);

  const initMap = (lat: number, lng: number) => {
    if (!mapRef.current || !window.google) return;

    // Create map
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    // Create draggable marker
    const markerInstance = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      title: "Drag me to your property location",
    });

    setMap(mapInstance);
    setMarker(markerInstance);

    // Get initial address
    getAddressFromLatLng(lat, lng);

    // Add click listener to map
    mapInstance.addListener("click", (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      markerInstance.setPosition(event.latLng);
      getAddressFromLatLng(lat, lng);
    });

    // Add drag end listener to marker
    markerInstance.addListener("dragend", (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      getAddressFromLatLng(lat, lng);
    });
  };

  const bootMap = async () => {
    if (booted) return;
    setBooted(true);

    // Priority:
    // 1) external coords (autocomplete)
    // 2) initial coords (edit / resume)
    // 3) user's current location (if allowed)
    // 4) fallback to Jaipur
    const fallback = { lat: 26.9124, lng: 75.7873 };
    const hasExternal =
      typeof externalLat === "number" && typeof externalLng === "number";
    const hasInitial =
      typeof initialLat === "number" && typeof initialLng === "number";

    if (hasExternal) {
      initMap(externalLat as number, externalLng as number);
      return;
    }
    if (hasInitial) {
      initMap(initialLat as number, initialLng as number);
      return;
    }

    if (autoUseCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          initMap(position.coords.latitude, position.coords.longitude);
        },
        () => {
          initMap(fallback.lat, fallback.lng);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
      return;
    }

    initMap(fallback.lat, fallback.lng);
  };

  const getAddressFromLatLng = (lat: number, lng: number) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results: any[], status: string) => {
      if (status === "OK" && results[0]) {
        const place = results[0];
        
        let address = "";
        let city = "";
        let state = "";
        let pincode = "";

        // Extract address components
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

        // If no specific address found, use formatted address
        if (!address.trim()) {
          address = place.formatted_address || "";
        }

        const locationData = {
          address: address.trim(),
          city: city || "",
          state: state || "",
          pincode: pincode || "",
          lat,
          lng,
        };

        setSelectedAddress(place.formatted_address || "");
        onLocationSelect(locationData);

        console.log("Selected location:", locationData);
      } else {
        console.error("Geocoder failed:", status);
      }
    });
  };

  // Function to search and move to location
  const searchLocation = (searchQuery: string) => {
    if (!window.google || !map || !marker) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: searchQuery }, (results: any[], status: string) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(15);
        marker.setPosition(location);
        getAddressFromLatLng(location.lat(), location.lng());
      }
    });
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (map && marker) {
            const location = { lat, lng };
            map.setCenter(location);
            map.setZoom(15);
            marker.setPosition(location);
            getAddressFromLatLng(lat, lng);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="space-y-3">
      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-[400px]" />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-1">How to mark your location:</p>
            <ul className="text-blue-700 space-y-1 text-xs">
              <li>• <strong>Click</strong> anywhere on the map to place the marker</li>
              <li>• <strong>Drag</strong> the marker to adjust the exact location</li>
              <li>
                • Use the <strong>&quot;Use My Location&quot;</strong> button to
                auto-detect
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Location Button */}
      <button
        type="button"
        onClick={getCurrentLocation}
        className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        <MapPin className="w-4 h-4" />
        Use My Current Location
      </button>

      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-green-900 mb-1">Selected Location:</p>
          <p className="text-sm text-green-700">{selectedAddress}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMapPicker;
