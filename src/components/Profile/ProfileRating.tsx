"use client";
import React, { useContext } from "react";
import StarRating from "./StarRating";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
export default function ProfileRating() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  return (
    <div className="max-w-[1080px] mx-auto flex flex-col justify-center items-center gap-5">
      {/* /<div className="flex justify-center items-center flex-col"> */}
        {/* <h1 className="text-2xl font-medium">Profile Ratings</h1>
        <StarRating rating={4} /> */}
      {/* </div> */}
      <div className="justify-between items-center flex w-full lg:flex-row flex-wrap">
        <button
          className="rounded-xl py-3 px-6 bg-gray-300 lg:text-2xl text-lg font-medium border-[5px] transition-all hover:scale-105 duration-200 border-gray-400"
          onClick={() => {
            router.push(`/updateProfile?id=${userContext?.userAuthData?._id}`);
          }}
        >
          Edit Profile
        </button>
        <button
          className="rounded-xl py-3 px-6 bg-gray-300 lg:text-2xl text-lg font-medium border-[5px] transition-all hover:scale-105 duration-200 border-gray-400"
          onClick={() => {
            router.push("/test");
          }}
        >
          Apartments
        </button>
      </div>
    </div>
  );
}
