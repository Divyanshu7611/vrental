"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Search, MapPin, Home, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";

function Hero() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    location: "",
    propertyType: "",
    budget: "",
  });

  const handleSearch = () => {
    if (searchParams.propertyType) {
      router.push(`/category?category=${searchParams.propertyType}`);
    } else {
      router.push("/category?category=ROOM");
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/homepage.png"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center min-h-[600px] lg:min-h-[700px]">
        <div className="w-full lg:w-2/3 space-y-8">
          {/* Hero Text */}
          <div className="space-y-6">
            {/* Vrental Logo & Brand */}
            {/* <div className="flex items-center gap-4 mb-2"> */}

              <h1 
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-800 tracking-tight" 
                style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', letterSpacing: '-0.02em' }}
              >
                Vrental
              </h1>
            {/* </div> */}
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white leading-tight">
              Your Perfect Home <span className="text-gray-700 font-bold">Awaits You</span>              <br />
            </h2>
         =
          </div>

      

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-4xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Search for available properties
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={searchParams.location}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, location: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E0FF] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={searchParams.propertyType}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        propertyType: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E0FF] focus:border-transparent outline-none transition appearance-none bg-white"
                  >
                    <option value="">Select Type</option>
                    <option value="ROOM">Room</option>
                    <option value="HOSTEL">Hostel</option>
                    <option value="PG">PG</option>
                    <option value="FLAT">Flat</option>
                    <option value="CO-LIVING">Co-Living</option>
                    <option value="SHOP">Shop</option>
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={searchParams.budget}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, budget: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E0FF] focus:border-transparent outline-none transition appearance-none bg-white"
                  >
                    <option value="">Select Budget</option>
                    <option value="0-5000">₹0 - ₹5,000</option>
                    <option value="5000-10000">₹5,000 - ₹10,000</option>
                    <option value="10000-20000">₹10,000 - ₹20,000</option>
                    <option value="20000+">₹20,000+</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full bg-[#156f6f] hover:bg-[#00E0FF] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Search className="w-5 h-5" />
                  Search Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
