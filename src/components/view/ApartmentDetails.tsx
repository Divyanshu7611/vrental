"use client";
import React, { useEffect, useState } from "react";
import Swipper from "./Swiper";
import StarRating from "../Profile/StarRating";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import OwnerDetails from "./OwnerDetails";
import { useRouter } from "next/navigation";
import {
  FaTv,
  FaSnowflake,
  FaFan,
  FaWifi,
  FaUtensils,
  FaBreadSlice,
  FaFire,
  FaBroom,
  FaCouch,
  FaBed,
  FaChair,
  FaBook,
  FaDoorOpen,
  FaLaptop,
  FaTable,
  FaGraduationCap,
} from "react-icons/fa";
import { IoMdCube } from "react-icons/io";
import { MdTableRestaurant, MdCoffee } from "react-icons/md";
import { GiWashingMachine, GiCooler } from "react-icons/gi";
import { BiSolidTv, BiFridge } from "react-icons/bi";
import { BsBox } from "react-icons/bs";

interface ApartmentDetailsProps {
  data: {
    apartmentName: string;
    image_urls: string[];
    description: string;
    location: string;
    price: number;
    contactNo: number;
    category: string;
    facility: string;
    furniture: string;
    availableFor: string;
    averageRating: number;
    status: string;
  };
}

// Icon mapping for facilities
const facilityIcons: { [key: string]: React.ReactNode } = {
  Television: <FaTv className="w-5 h-5" />,
  TV: <FaTv className="w-5 h-5" />,
  Refrigerator: <BiFridge className="w-5 h-5" />,
  Micorwave: <IoMdCube className="w-5 h-5" />,
  Microwave: <IoMdCube className="w-5 h-5" />,
  Toaster: <FaBreadSlice className="w-5 h-5" />,
  Oven: <FaFire className="w-5 h-5" />,
  "Washing Machine": <GiWashingMachine className="w-5 h-5" />,
  "Air Conditioner": <FaSnowflake className="w-5 h-5" />,
  AC: <FaSnowflake className="w-5 h-5" />,
  Cooler: <GiCooler className="w-5 h-5" />,
  Fan: <FaFan className="w-5 h-5" />,
  "Vacuum Cleaner": <FaBroom className="w-5 h-5" />,
  Wifi: <FaWifi className="w-5 h-5" />,
  WiFi: <FaWifi className="w-5 h-5" />,
};

// Icon mapping for furniture
const furnitureIcons: { [key: string]: React.ReactNode } = {
  Sofa: <FaCouch className="w-5 h-5" />,
  Bed: <FaBed className="w-5 h-5" />,
  "Dining Table": <MdTableRestaurant className="w-5 h-5" />,
  "Coffee & Tea Table": <MdCoffee className="w-5 h-5" />,
  Dressing: <FaDoorOpen className="w-5 h-5" />,
  Chair: <FaChair className="w-5 h-5" />,
  Bookshelf: <FaBook className="w-5 h-5" />,
  Wardrobe: <FaDoorOpen className="w-5 h-5" />,
  Desk: <FaLaptop className="w-5 h-5" />,
  "TV Stand": <BiSolidTv className="w-5 h-5" />,
  "TV Stand ": <BiSolidTv className="w-5 h-5" />,
  Nightstand: <BsBox className="w-5 h-5" />,
  "Study Table": <FaGraduationCap className="w-5 h-5" />,
};

// Helper function to get icon for facility/furniture
const getIcon = (item: string, type: "facility" | "furniture"): React.ReactNode => {
  const iconMap = type === "facility" ? facilityIcons : furnitureIcons;
  // Try exact match first
  if (iconMap[item]) {
    return iconMap[item];
  }
  // Try case-insensitive match
  const normalizedItem = item.trim();
  const key = Object.keys(iconMap).find(
    (k) => k.toLowerCase() === normalizedItem.toLowerCase()
  );
  if (key) {
    return iconMap[key];
  }
  // Default icon if not found
  return type === "facility" ? <FaUtensils className="w-5 h-5" /> : <FaTable className="w-5 h-5" />;
};

const ApartmentDetails: React.FC<ApartmentDetailsProps> = ({ data, ownerData, contactNo }:any) => {
  const router = useRouter();
  // Split the facility string into an array
  const facilityList = data.facility.split(", ");
  const furnitureList = data.furniture.split(", ");

  // Determine how many columns are needed
  const columns = Math.ceil(facilityList.length / 5);

  // Create an array of columns
  const facilityColumns = Array.from({ length: columns }, (_, columnIndex) =>
    facilityList.slice(columnIndex * 5, (columnIndex + 1) * 5)
  );

  const furnitureColumns = Array.from(
    { length: Math.ceil(furnitureList.length / 5) },
    (_, columnIndex) =>
      furnitureList.slice(columnIndex * 5, (columnIndex + 1) * 5)
  );
  const handleBackClick = () => {
    // Navigate back
    history.back();

    // Restore the scroll position after a short delay
    setTimeout(() => {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
        sessionStorage.removeItem("scrollPosition"); // Optional: Remove the scroll position after using it
      }
    }, 0);
  };
  // return (
  //   <div className="p-5 rounded-lg shadow-lg w-full">
  //     <button
  //       className="px-3 py-1 bg-blue-600 text-white rounded-lg mb-2 hover:scale-105 transition-all duration-200"
  //       onClick={handleBackClick}
  //     >
  //       Back Menu
  //     </button>
  //     <p className="text-[#283a82] font-semibold lg:text-2xl text-lg mb-2">
  //       Status: {data.status}
  //     </p>
  //     <Swipper images={data.image_urls} />
  //     <div className="flex w-full justify-between mt-6">
  //       <div className="flex flex-col">
  //         <h1 className="lg:text-2xl text-lg font-bold capitalize">
  //           {data.apartmentName}
  //         </h1>
  //         <p className="lg:text-sm text-xs">{data.category}</p>
  //       </div>
  //       <div className="flex flex-col">
  //         <p className="text-[#283a82] font-semibold lg:text-2xl text-lg">
  //           Price: ₹{data.price}/Month
  //         </p>
  //       </div>
  //     </div>
  //     <p className="text-lg font-medium">Available For: {data.availableFor}</p>
  //     <p className="text-lg font-medium capitalize">
  //       Location: {data.location}
  //     </p>
  //     <StarRating rating={data.averageRating} />

  //     <div className="bg-gray-100 w-full rounded-xl p-4 mt-12">
  //       <p className="text-lg font-medium mb-2">Facilities:</p>
  //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
  //         {facilityColumns.map((column, columnIndex) => (
  //           <div key={columnIndex} className="flex flex-col">
  //             {column.map((facility, index) => (
  //               <div key={index} className="flex items-center mb-2">
  //                 <input
  //                   type="checkbox"
  //                   id={`facility-${columnIndex}-${index}`}
  //                   className="mr-2"
  //                   disabled
  //                 />
  //                 <label
  //                   htmlFor={`facility-${columnIndex}-${index}`}
  //                   className="text-lg"
  //                 >
  //                   {facility}
  //                 </label>
  //               </div>
  //             ))}
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //     {/* furniture */}
  //     <div className="bg-gray-100 w-full rounded-xl p-4 mt-12">
  //       <p className="text-lg font-medium mb-2">Furniture:</p>
  //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
  //         {furnitureColumns.map((column, columnIndex) => (
  //           <div key={columnIndex} className="flex flex-col">
  //             {column.map((furniture, index) => (
  //               <div key={index} className="flex items-center mb-2">
  //                 <input
  //                   type="checkbox"
  //                   id={`facility-${columnIndex}-${index}`}
  //                   className="mr-2"
  //                   disabled
  //                 />
  //                 <label
  //                   htmlFor={`facility-${columnIndex}-${index}`}
  //                   className="text-lg"
  //                 >
  //                   {furniture}
  //                 </label>
  //               </div>
  //             ))}
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     <div className="bg-gray-100 w-full rounded-xl p-4 mt-12">
  //       <p className="text-lg font-medium mb-2">Description:</p>

  //       {data.description}
  //     </div>
  //   </div>
  // );

  return (
    <div className="px-4 lg:px-10 py-6 mx-auto max-w-[1400px]">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4 hover:scale-105 transition"
        onClick={handleBackClick}
      >
        Back
      </button>
  
      {/* STATUS */}
      <p className="text-[#283a82] font-semibold text-lg mb-4">
        Status: {data.status}
      </p>
  
      {/* IMAGE GRID */}
      <div className="mb-8">
        <Swipper images={data.image_urls} />
      </div>
  
      {/* MAIN CONTENT SECTION */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-8">
        
        {/* LEFT SIDE - Main Content */}
        <div className="flex-1 lg:space-y-8">
  
          {/* Title + Location + Rating + Price */}
          <div className="space-y-3 border-b pb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold capitalize mb-2">
                  {data.apartmentName}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-gray-600 mb-2">
                  <span className="text-sm">{data.category}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm">{data.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={data.averageRating} />
                </div>
              </div>
  
              <div className="text-right">
                <p className="text-3xl font-bold text-[#283a82]">
                  ₹{data.price}
                </p>
                <p className="text-gray-500 text-sm">/Month</p>
              </div>
            </div>
          </div>
  
          {/* Available For */}
          <div className="pt-4">
            <h2 className="font-semibold text-xl mb-3">
              Available For
            </h2>
            <p className="text-gray-700">{data.availableFor}</p>
          </div>
  
          {/* Facilities */}
          <div className="pt-4">
            <h2 className="font-semibold text-xl mb-4">
              Facilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {facilityList.map((facility:any, index:any) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-[#00F0FF] flex-shrink-0">
                    {getIcon(facility, "facility")}
                  </div>
                  <p className="text-gray-700">{facility}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Furniture */}
          <div className="pt-4">
            <h2 className="font-semibold text-xl mb-4">
              Furniture
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {furnitureList.map((item:any, index:any) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-[#00F0FF] flex-shrink-0">
                    {getIcon(item, "furniture")}
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Description */}
          <div className="pt-4">
            <h2 className="font-semibold text-xl mb-4">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          </div>
        </div>
  
        {/* RIGHT SIDE → Owner Card */}
        <div className="lg:w-96 flex-shrink-0">
          <OwnerDetails
            data={ownerData}
            contactNo={data.contactNo}
          />
        </div>
      </div>
    </div>
  );

};

export default ApartmentDetails;
