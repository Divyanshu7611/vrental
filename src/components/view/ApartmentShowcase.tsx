// app/page.tsx
"use client";

import React, { useState } from 'react';
import { Search, MapPin, Home as HomeIcon, BedDouble, Bath } from 'lucide-react';

type Apartment = {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  isAvailable: boolean;
};

const SAMPLE_APARTMENTS: Apartment[] = [
  {
    id: '1',
    title: 'Modern Studio Apartment',
    location: 'Indiranagar, Bangalore',
    price: 25000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 550,
    imageUrl: '/api/placeholder/800/600',
    isAvailable: true
  },
  {
    id: '2',
    title: 'Luxury 3BHK with Garden',
    location: 'Koramangala, Bangalore',
    price: 45000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    imageUrl: '/api/placeholder/800/600',
    isAvailable: true
  },
  {
    id: '3',
    title: 'Cozy 2BHK Near Metro',
    location: 'HSR Layout, Bangalore',
    price: 35000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 900,
    imageUrl: '/api/placeholder/800/600',
    isAvailable: false
  }
];

function ApartmentCard({ apartment }: { apartment: Apartment }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={apartment.imageUrl} 
          alt={apartment.title}
          className="w-full h-48 object-cover"
        />
        <span 
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-sm ${
            apartment.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {apartment.isAvailable ? 'Available' : 'Rented'}
        </span>
      </div>
      
      <div className="p-4">
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
            <HomeIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{apartment.sqft} sqft</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-lg font-semibold text-gray-900">
            ₹{apartment.price.toLocaleString()}/month
          </div>
          <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const filteredApartments = SAMPLE_APARTMENTS.filter(apartment => {
    const matchesSearch = apartment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apartment.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || 
                           apartment.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Home
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Explore our curated selection of premium rental properties
        </p>
        
        {/* Search Section */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by property name or location..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="all">All Locations</option>
            <option value="indiranagar">Indiranagar</option>
            <option value="koramangala">Koramangala</option>
            <option value="hsr">HSR Layout</option>
          </select>
        </div>
      </div>

      {/* Apartment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApartments.map((apartment) => (
          <ApartmentCard key={apartment.id} apartment={apartment} />
        ))}
      </div>
    </div>
  );
}