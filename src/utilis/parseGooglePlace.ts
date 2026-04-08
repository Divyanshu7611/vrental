export type ParsedPlace = {
  address: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
  /** Same as fullAddress; kept for storage / UI that expect this name */
  formattedAddress?: string;
  lat: number;
  lng: number;
};

/** Parse Places / Geocoder `address_components` into city, state, etc. */
export function parseAddressComponents(
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>,
  formatted_address: string,
  lat: number,
  lng: number
): ParsedPlace {
  let address = "";
  let city = "";
  let state = "";
  let pincode = "";

  address_components.forEach((component) => {
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

  if (!city) {
    const locality = address_components.find((c) => c.types.includes("locality"));
    if (locality) city = locality.long_name;
  }
  if (!city) {
    const adm = address_components.find((c) =>
      c.types.includes("administrative_area_level_2")
    );
    if (adm) city = adm.long_name;
  }

  if (!address.trim()) {
    address = formatted_address || "";
  }

  const full = formatted_address || "";
  return {
    address: address.trim(),
    city: city || "",
    state: state || "",
    pincode: pincode || "",
    fullAddress: full,
    formattedAddress: full,
    lat,
    lng,
  };
}
