import React from "react";

const SkeletonCard = () => {
  return (
    <div className="p-2 border flex flex-col bg-white justify-between gap-5 rounded-lg mx-auto w-[265px] h-[350px] overflow-hidden">
      <div className="skeleton-image animate-pulse bg-gray-200 h-[200px] w-full rounded"></div>
      <div className="flex flex-col justify-between gap-2">
        <div className="skeleton-text animate-pulse bg-gray-200 h-6 w-3/4 rounded"></div>
        <div className="skeleton-text animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
        <div className="skeleton-text animate-pulse bg-gray-200 h-3 w-full rounded"></div>
        <div className="skeleton-text animate-pulse bg-gray-200 h-3 w-1/4 rounded"></div>
      </div>
      <style jsx>{`
        @keyframes glowing {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        .skeleton-image,
        .skeleton-text {
          background-image: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200px 100%;
          background-repeat: no-repeat;
          animation: glowing 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default SkeletonCard;
