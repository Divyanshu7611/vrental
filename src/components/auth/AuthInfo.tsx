"use client";
import React from "react";
import Image from "next/image";
import { 
  ShieldCheck, 
  Home, 
  TrendingUp, 
  Bell,
  Clock,
  MapPin,
  Heart
} from "lucide-react";

export default function AuthInfo() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Locations",
      description: "All properties verified"
    },
    {
      icon: Home,
      title: "Lifestyle Homes",
      description: "Curated living spaces"
    },
    {
      icon: TrendingUp,
      title: "Free Valuation",
      description: "Get instant estimates"
    },
    {
      icon: Bell,
      title: "Latest Updates",
      description: "Real-time notifications"
    },
  ];

  return (
    <div className="relative max-w-[480px] space-y-8 z-10">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/assets/Logo.png"
          alt="Vrental"
          width={50}
          height={50}
          className="drop-shadow-lg"
        />
        <h1 className="text-3xl font-bold tracking-wide text-white drop-shadow-md">
          VRENTAL
        </h1>
      </div>

      {/* Main Message */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold leading-tight text-white drop-shadow-md">
          Find Your Perfect Home Effortlessly
        </h2>

        <p className="text-white/90 text-base leading-relaxed">
          Join thousands discovering verified properties, real-time updates,
          and trusted rental insights — all in one platform.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-start space-y-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-xs text-white/80">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="border-t border-white/20 pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Quick & Easy Search
            </h3>
            <p className="text-xs text-white/80">
              Find your perfect home in minutes, not days
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Prime Locations
            </h3>
            <p className="text-xs text-white/80">
              Properties in the best neighborhoods across the city
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Customer First
            </h3>
            <p className="text-xs text-white/80">
              Dedicated support to help you every step of the way
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
