import React from "react";
import Image from "next/image";

export default function FlatCard() {
  return (
    <div className="bg-white rounded-lg w-full flex flex-wrap pl-5 justify-between">
      <div className="flex flex-col justify-between max-h-[315px] py-5">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-normal">Lotus Flats</h1>
          <p className="text-sm text-black opacity-50">
            Best flats for rent in just 18000₹/month with all facilities and a
            eco-friendly environment.
          </p>
          <p className="text-sm text-black opacity-50">
            Near railway station, Kota, Rajasthan.
          </p>
        </div>
        <div>
          <button className="border border-[#1FA5AD] bg-transparent rounded-lg text-[#1FA5AD] text-sm px-4 py-1 hover:scale-105 transition-all duration-200">
            View Flat
          </button>
        </div>
      </div>
      <div>
        <Image src="/assets/flat.png" alt="flatcard" height={315} width={500} />
      </div>
    </div>
  );
}
