/**
 * Loads Google Maps JS API once (with Places library) for autocomplete / geocoding.
 */
export function loadGoogleMapsPlaces(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("No window"));
      return;
    }
    const w = window as Window & { google?: { maps?: { places?: unknown } } };
    if (w.google?.maps?.places) {
      resolve();
      return;
    }
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"));
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="maps.googleapis.com"][src*="libraries=places"]'
    );
    if (existing) {
      const t = setInterval(() => {
        const win = window as Window & { google?: { maps?: { places?: unknown } } };
        if (win.google?.maps?.places) {
          clearInterval(t);
          resolve();
        }
      }, 40);
      setTimeout(() => {
        clearInterval(t);
        const win = window as Window & { google?: { maps?: { places?: unknown } } };
        if (win.google?.maps?.places) resolve();
        else reject(new Error("Google Maps Places load timeout"));
      }, 20000);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const poll = setInterval(() => {
        const win = window as Window & { google?: { maps?: { places?: unknown } } };
        if (win.google?.maps?.places) {
          clearInterval(poll);
          resolve();
        }
      }, 40);
      setTimeout(() => {
        clearInterval(poll);
        const win = window as Window & { google?: { maps?: { places?: unknown } } };
        if (win.google?.maps?.places) resolve();
        else reject(new Error("Places API not ready"));
      }, 15000);
    };
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}
