"use client";
import axios from "axios";
import React, { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import StarRating from "../Profile/Rating";
import ShareButton from "../mini/ShareButton";

interface OwnerDetailsProps {
  data: {
    firstName: string;
    lastName: string;
    image: string;
    email: string;
  };
  contactNo: number;
}

const OwnerDetails: React.FC<OwnerDetailsProps> = ({ data, contactNo }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallProcessing, setCallProcessing] = useState(false);

  const [isApplied, setIsApplied] = useState(false);
  const [isCall, setIsCall] = useState(false);

  const userContext = useContext(UserContext);
  const searchParams = useSearchParams();
  const id = searchParams.get("apartmentID");

  const handleInterestedClick = async () => {
    try {
      setIsProcessing(true);
      const response = await axios.post("/api/aparment/interested", {
        UserID: userContext?.userAuthData?._id, // Replace with actual user ID
        ApartmentID: id, // Replace with actual apartment ID
        ownerEmail: data.email,
      });

      if (response.status === 200) {
        // Handle success (e.g., show a success message)
        alert("You have successfully registered your interest.");
        setIsApplied(true);
      }
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Error registering interest:", error);
      alert("There was an error registering your interest. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  // calling function
  const handleCallClick = async () => {
    try {
      setCallProcessing(true);
      const response = await axios.post("/api/aparment/call", {
        UserID: userContext?.userAuthData?._id, // Replace with actual user ID
        ApartmentID: id, // Replace with actual apartment ID
        ownerEmail: data.email,
      });

      if (response.status === 200) {
        // Handle success (e.g., show a success message)
        setIsCall(true);
      }
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Error registering interest:", error);
    } finally {
      setCallProcessing(false);
    }
  };

  // return (
  //   <div className="lg:w-1/4 flex lg:flex-col items-center flex-row gap-5">
  //     <div className="flex flex-col justify-center items-center">
  //       <img
  //         src={`https://api.dicebear.com/5.x/initials/svg?seed=${data.firstName} ${data.lastName}&backgroundColor=418FA9`}
  //         alt="Owner"
  //         height={200}
  //         width={200}
  //         className="rounded-full border-[10px] border-gradient-to-b from-[#00F0FF] to-[#00666D] mb-4"
  //       />

  //       <h2 className="lg:text-xl text-lg font-semibold mb-2 text-center">
  //         {data.firstName} {data.lastName}
  //       </h2>
  //     </div>
  //     <div className="flex flex-col gap-3">
  //       <a href={`tel:${contactNo}`}>
  //         <button
  //           className="mb-2 bg-[#00F0FF] border border-black rounded-2xl text-black font-semibold py-2 px-8 hover:scale-105 transition-all w-full"
  //           onClick={handleCallClick}
  //         >
  //           Call Now
  //         </button>
  //       </a>

  //       <ShareButton />

  //       <a>
  //         <button
  //           className="bg-[#00F0FF] border border-black rounded-2xl text-black font-semibold py-2 px-8 hover:scale-105 transition-all w-full"
  //           onClick={handleInterestedClick}
  //           disabled={isProcessing || isApplied}
  //         >
  //           {isProcessing
  //             ? "Processing..."
  //             : isApplied
  //             ? "Applied"
  //             : "Interested"}
  //         </button>
  //       </a>
  //       <p>Rate Appartment</p>
  //       <StarRating userId={userContext?.userAuthData?._id} apartmentId={id} />
  //     </div>
  //   </div>
  // );
  return (
    <div className="sticky top-24 bg-white shadow-xl rounded-2xl p-6 border">
      
      {/* Owner Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={`https://api.dicebear.com/5.x/initials/svg?seed=${data.firstName} ${data.lastName}&backgroundColor=418FA9`}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="font-semibold text-lg">
            {data.firstName} {data.lastName}
          </h2>
          <p className="text-sm text-gray-500">Property Owner</p>
        </div>
      </div>
  
      {/* Price Highlight */}
      <div className="border rounded-xl p-4 mb-6">
        <p className="text-2xl font-bold">
          ₹{contactNo}
        </p>
        <p className="text-gray-500 text-sm">
          Contact directly
        </p>
      </div>
  
      {/* Buttons */}
      <div className="space-y-3">
        <a href={`tel:${contactNo}`}>
          <button
            className="w-full bg-[#00F0FF] py-3 rounded-xl font-semibold hover:scale-105 transition"
            onClick={handleCallClick}
          >
            Call Now
          </button>
        </a>
  
        <button
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
          onClick={handleInterestedClick}
          disabled={isProcessing || isApplied}
        >
          {isProcessing
            ? "Processing..."
            : isApplied
            ? "Applied"
            : "Interested"}
        </button>
  
        <ShareButton />
      </div>
  
      {/* Rating */}
      <div className="mt-6 border-t pt-4">
        <p className="font-medium mb-2">
          Rate Apartment
        </p>
        <StarRating
          userId={userContext?.userAuthData?._id}
          apartmentId={id}
        />
      </div>
    </div>
  );

};

export default OwnerDetails;
