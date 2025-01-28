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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Edit Profile Button */}
          <button
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 p-[2px] transition-all hover:shadow-lg"
            onClick={() => {
              router.push(`/updateProfile?id=${userContext?.userAuthData?._id}`);
            }}
          >
            <div className="relative flex items-center gap-2 rounded-[10px] bg-white px-6 py-3 transition-all group-hover:bg-opacity-90">
              <Pencil className="h-5 w-5 text-cyan-600" />
              <span className="font-semibold text-gray-800">Edit Profile</span>
            </div>
            <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-20">
              <div className="h-full w-full bg-gradient-to-r from-white via-transparent to-transparent animate-shimmer"></div>
            </div>
          </button>

          {/* Apartments Button */}
          <button
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 p-[2px] transition-all hover:shadow-lg"
            onClick={() => {
              router.push("/test");
            }}
          >
            <div className="relative flex items-center gap-2 rounded-[10px] bg-white px-6 py-3 transition-all group-hover:bg-opacity-90">
              <Home className="h-5 w-5 text-cyan-600" />
              <span className="font-semibold text-gray-800">Apartments</span>
            </div>
            <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-20">
              <div className="h-full w-full bg-gradient-to-r from-white via-transparent to-transparent animate-shimmer"></div>
            </div>
          </button>
        </div>

        {/* Star Rating Section (Commented out but styled) */}
        {/* <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile Rating</h2>
          <StarRating rating={4} />
        </div> */}
      </div>

      {/* Add custom animation keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}