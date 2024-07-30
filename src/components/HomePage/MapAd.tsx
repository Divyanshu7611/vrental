import React from "react";
import Image from "next/image";
export default function MapAd() {
  return (
    <div>
      <div className="bg-white w-full flex-col-reverse lg:flex-row flex justify-between items-center mt-10 lg:rounded-lg mb-10">
        <div className="flex-col flex justify-between gap-16 p-5 w-full">
          <div className="flex flex-col gap-3">
            <h1 className="font-medium text-2xl text-black">
              Search Your Dream Room On The Map
            </h1>
            <p className="text-black opacity-50 text-sm">
              Find the rooms you are looking for easily according to location
              <br />
              information.
            </p>
          </div>
          <div>
            <button className="border-none bg-red-700 rounded-3xl text-white text-lg px-6 py-3 hover:scale-105 transition-all duration-200">
              Search On Map
            </button>
          </div>
        </div>

        <Image
          src="/assets/map.png"
          alt="maps"
          height={293}
          width={267}
          className="w-full h-full lg:h-[293px] lg:w-[267px]"
        />
      </div>
    </div>
  );
}
