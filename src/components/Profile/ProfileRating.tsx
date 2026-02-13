// "use client";
// import React, { useContext } from "react";
// import StarRating from "./StarRating";
// import { useRouter } from "next/navigation";
// import { UserContext } from "@/context/UserContext";
// export default function ProfileRating() {
//   const router = useRouter();
//   const userContext = useContext(UserContext);
//   return (
//     <div className="max-w-[1080px] mx-auto flex flex-col justify-center items-center gap-5">
//       {/* /<div className="flex justify-center items-center flex-col"> */}
//         {/* <h1 className="text-2xl font-medium">Profile Ratings</h1>
//         <StarRating rating={4} /> */}
//       {/* </div> */}
//       <div className="justify-between items-center flex w-full lg:flex-row flex-wrap">
//         <button
//           className="rounded-xl py-3 px-6 bg-gray-300 lg:text-2xl text-lg font-medium border-[5px] transition-all hover:scale-105 duration-200 border-gray-400"
//           onClick={() => {
//             router.push(`/updateProfile?id=${userContext?.userAuthData?._id}`);
//           }}
//         >
//           Edit Profile
//         </button>
//         <button
//           className="rounded-xl py-3 px-6 bg-gray-300 lg:text-2xl text-lg font-medium border-[5px] transition-all hover:scale-105 duration-200 border-gray-400"
//           onClick={() => {
//             router.push("/test");
//           }}
//         >
//           Apartments
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useContext } from "react";
import StarRating from "./StarRating";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { Pencil, Home } from "lucide-react";

export default function ProfileRating() {
  const router = useRouter();
  const userContext = useContext(UserContext);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
          {/* Edit Profile Button */}
          <button
            className="group relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-xl"
            onClick={() => {
              router.push(`/updateProfile?id=${userContext?.userAuthData?._id}`);
            }}
          >
            <div className="relative flex items-center justify-center gap-3 px-6 py-4 transition-all">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Pencil className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-900 text-base">Edit Profile</span>
                <span className="text-xs text-gray-500">Update your information</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Apartments Button */}
          <button
            className="group relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 hover:border-cyan-500 transition-all duration-300 hover:shadow-xl"
            onClick={() => {
              router.push("/list-apartment");
            }}
          >
            <div className="relative flex items-center justify-center gap-3 px-6 py-4 transition-all">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-900 text-base">Add Apartment</span>
                <span className="text-xs text-gray-500">List a new property</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
}