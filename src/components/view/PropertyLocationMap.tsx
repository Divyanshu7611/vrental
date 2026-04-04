"use client";
import React, { useEffect, useRef, useState } from "react";
import { MapPin, ExternalLink, Loader2 } from "lucide-react";

interface PropertyLocationMapProps {
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  address: string;
  propertyName: string;
}

declare global {
  interface Window {
    google: any;
  }
}

const PropertyLocationMap: React.FC<PropertyLocationMapProps> = ({
  coordinates,
  address,
  propertyName,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLat, setCurrentLat] = useState<number>(coordinates?.latitude || 26.9124);
  const [currentLng, setCurrentLng] = useState<number>(coordinates?.longitude || 75.7873);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Debug: Log received coordinates
  useEffect(() => {
    console.log("PropertyLocationMap received coordinates:", coordinates);
    console.log("Address:", address);
    if (coordinates?.latitude && coordinates?.longitude) {
      console.log("Using stored coordinates:", coordinates.latitude, coordinates.longitude);
      setCurrentLat(coordinates.latitude);
      setCurrentLng(coordinates.longitude);
    } else {
      console.log("No coordinates found, will geocode address");
    }
  }, [coordinates, address]);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      // If no coordinates, geocode the address
      if (!coordinates?.latitude || !coordinates?.longitude) {
        geocodeAddress();
      } else {
        initMap();
      }
      return;
    }

    // Load Google Maps script if not already loaded
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com"]`
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setIsLoaded(true);
        // If no coordinates, geocode the address
        if (!coordinates?.latitude || !coordinates?.longitude) {
          geocodeAddress();
        } else {
          initMap();
        }
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
          // If no coordinates, geocode the address
          if (!coordinates?.latitude || !coordinates?.longitude) {
            geocodeAddress();
          } else {
            initMap();
          }
        }
      }, 100);
    }
  }, []);

  const geocodeAddress = () => {
    if (!window.google || !address) {
      initMap();
      return;
    }

    setIsGeocoding(true);
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: address }, (results: any[], status: string) => {
      setIsGeocoding(false);
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        setCurrentLat(location.lat());
        setCurrentLng(location.lng());
        console.log("Geocoded address:", address, "to", location.lat(), location.lng());
      } else {
        console.error("Geocoding failed:", status);
      }
      initMap();
    });
  };

  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const lat = currentLat;
    const lng = currentLng;

    // Create map
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
    });

    // Create marker
    const markerInstance = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance,
      title: propertyName,
      animation: window.google.maps.Animation.DROP,
    });

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 250px;">
          <h3 style="font-weight: bold; margin-bottom: 5px; color: #1a202c;">${propertyName}</h3>
          <p style="color: #4a5568; font-size: 14px; margin-bottom: 10px;">${address}</p>
          <a 
            href="https://www.google.com/maps?q=${lat},${lng}" 
            target="_blank" 
            rel="noopener noreferrer"
            style="color: #3182ce; text-decoration: underline; font-size: 14px;"
          >
            Open in Google Maps →
          </a>
        </div>
      `,
    });

    // Show info window on marker click
    markerInstance.addListener("click", () => {
      infoWindow.open(mapInstance, markerInstance);
    });

    // Open info window by default
    infoWindow.open(mapInstance, markerInstance);

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${currentLat},${currentLng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Property Location
        </h3>
        <button
          onClick={openInGoogleMaps}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open in Maps
        </button>
      </div>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        <div
          ref={mapRef}
          className="w-full h-[300px] cursor-pointer"
          onClick={openInGoogleMaps}
        />
      </div>

      {/* Address Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Address:</span> {address}
        </p>
        {coordinates?.latitude && coordinates?.longitude && (
          <p className="text-xs text-gray-500 mt-1">
            Coordinates: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Click on the map or the marker to open the location in Google Maps for directions.
        </p>
      </div>
    </div>
  );
};

export default PropertyLocationMap;
