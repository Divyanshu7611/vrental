import React from "react";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="relative w-14 h-14">
        {/* Outer spinning ring - blue gradient */}
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-blue-600 rounded-full animate-spin"></div>
        {/* Inner spinning ring - cyan accent */}
        <div className="absolute inset-2 border-3 border-transparent border-t-cyan-500 border-r-cyan-400 rounded-full animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
      </div>
    </div>
  );
}
