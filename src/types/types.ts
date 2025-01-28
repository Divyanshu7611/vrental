// types.ts
export interface IApartment {
    id: string;
    title: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    imageUrl: string;
    isAvailable: boolean;
    amenities: string[];
  }