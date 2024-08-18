"use client";
import React, { useEffect, useState } from "react";
import Swipper from "./Swiper";
import StarRating from "../Profile/StarRating";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

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

const ApartmentDetails: React.FC<ApartmentDetailsProps> = ({ data }) => {
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

  return (
    <div className="bg-gradient-to-b from-[#00FFFF] to-[#009999] lg:w-3/4 p-5 rounded-lg shadow-lg w-full">
      <button
        className="px-3 py-1 bg-gray-600 text-white rounded-lg mb-2 hover:scale-105 transition-all duration-200"
        onClick={() => {
          router.back();
        }}
      >
        Back Menu
      </button>
      <p className="text-[#FF0000] font-semibold lg:text-2xl text-lg mb-2">
        Status: {data.status}
      </p>
      <Swipper images={data.image_urls} />
      <div className="flex w-full justify-between mt-6">
        <div className="flex flex-col">
          <h1 className="lg:text-2xl text-lg font-bold">
            {data.apartmentName}
          </h1>
          <p className="lg:text-sm text-xs">{data.category}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[#FF0000] font-semibold lg:text-2xl text-lg">
            Price: ₹{data.price}
          </p>
        </div>
      </div>
      <p className="text-lg font-medium">Available For: {data.availableFor}</p>
      <p className="text-lg font-medium">Location: {data.location}</p>
      <StarRating rating={data.averageRating} />

      <div className="bg-gradient-to-b from-[#00FFFF] to-[#009999] w-full rounded-xl p-4 mt-12">
        <p className="text-lg font-medium mb-2">Facilities:</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
          {facilityColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col">
              {column.map((facility, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`facility-${columnIndex}-${index}`}
                    className="mr-2"
                    disabled
                  />
                  <label
                    htmlFor={`facility-${columnIndex}-${index}`}
                    className="text-lg"
                  >
                    {facility}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* furniture */}
      <div className="bg-gradient-to-b from-[#00FFFF] to-[#009999] w-full rounded-xl p-4 mt-12">
        <p className="text-lg font-medium mb-2">Furniture:</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
          {furnitureColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col">
              {column.map((furniture, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`facility-${columnIndex}-${index}`}
                    className="mr-2"
                    disabled
                  />
                  <label
                    htmlFor={`facility-${columnIndex}-${index}`}
                    className="text-lg"
                  >
                    {furniture}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#00FFFF] to-[#009999] w-full rounded-xl p-4 mt-12">
        <p className="text-lg font-medium mb-2">Description:</p>

        {data.description}
      </div>
    </div>
  );
};

export default ApartmentDetails;
