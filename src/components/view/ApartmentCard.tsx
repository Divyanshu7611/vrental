// components/ApartmentCard.tsx
"use client";

import React from 'react';
import { MapPin, Home, IndianRupee, BedDouble, Bath } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IApartment } from '@/types/types';

interface ApartmentCardProps {
  apartment: IApartment;
}



const ApartmentCardHome: React.FC<ApartmentCardProps> = ({ apartment }) => {
  return (
    <div className="transform transition-all duration-300 hover:-translate-y-1">
      <Card className="overflow-hidden">
        <div className="relative">
          <img 
            src={apartment.imageUrl} 
            alt={apartment.title}
            className="w-full h-48 object-cover"
          />
          <Badge 
            variant={apartment.isAvailable ? "secondary" : "destructive"}
            className="absolute top-2 right-2"
          >
            {apartment.isAvailable ? 'Available' : 'Rented'}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            {apartment.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{apartment.location}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{apartment.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{apartment.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{apartment.sqft} sqft</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {apartment.amenities.map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              <span className="font-semibold text-lg">
                {apartment.price.toLocaleString()}
              </span>
              <span className="text-gray-600">/month</span>
            </div>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
              View Details
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApartmentCardHome;