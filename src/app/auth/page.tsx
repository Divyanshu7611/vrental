"use client";
import React from "react";
import AuthInfo from "@/components/auth/AuthInfo";
import AuthMain from "@/components/auth/AuthMain";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100 px-6 py-12">

      <div className="relative max-w-[1100px] w-full 
        rounded-2xl overflow-hidden 
        shadow-[0_20px_60px_rgba(0,0,0,0.15)] 
        bg-white flex">

        {/* Left Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative 
          bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 
          text-white p-12 items-center justify-center overflow-hidden">

          {/* Soft radial glow */}
          <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>

          <AuthInfo />
        </div>

        {/* Right Form Section */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <AuthMain />
          </div>
        </div>

      </div>
    </div>
  );
}
