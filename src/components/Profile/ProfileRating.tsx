import React from "react";
import StarRating from "./StarRating";
export default function ProfileRating() {
  return (
    <div className="max-w-[1080px] mx-auto flex flex-col justify-center items-center gap-5">
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-2xl font-medium">Profile Ratings</h1>
        <StarRating rating={4} />
      </div>
      <div className="justify-between items-center flex w-full lg:flex-row flex-wrap">
        <button className="rounded-xl py-3 px-6 bg-white lg:text-2xl text-lg font-medium border-[5px] transition-all hover:scale-105 duration-200 border-gradient-to-b from-[#00FFFF] to-[#009999]">
          Edit Profile
        </button>
        <button className="rounded-xl py-3 px-6 bg-white lg:text-2xl text-lg font-medium border-[5px] transition-all hover:scale-105 duration-200 border-gradient-to-b from-[#00FFFF] to-[#009999]">
          Apartments
        </button>
      </div>
    </div>
  );
}
