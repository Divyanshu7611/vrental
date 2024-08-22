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
}

const OwnerDetails: React.FC<OwnerDetailsProps> = ({ data }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
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

  return (
    <div className="lg:w-1/4 flex lg:flex-col items-center flex-row gap-5">
      <div className="flex flex-col justify-center items-center">
        <img
          src={`https://api.dicebear.com/5.x/initials/svg?seed=${data.firstName} ${data.lastName}&backgroundColor=418FA9`}
          alt="Owner"
          height={200}
          width={200}
          className="rounded-full border-[10px] border-gradient-to-b from-[#00F0FF] to-[#00666D] mb-4"
        />

        <h2 className="lg:text-xl text-lg font-semibold mb-2 text-center">
          {data.firstName} {data.lastName}
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        <a href="tel:9950156755">
          <button
            className="mb-2 bg-[#00F0FF] border border-black rounded-2xl text-black font-semibold py-2 px-8 hover:scale-105 transition-all w-full"
            onClick={handleInterestedClick}
          >
            Call Now
          </button>
        </a>

        <ShareButton />

        <a>
          <button
            className="bg-[#00F0FF] border border-black rounded-2xl text-black font-semibold py-2 px-8 hover:scale-105 transition-all w-full"
            onClick={handleInterestedClick}
            disabled={isProcessing || isApplied}
          >
            {isProcessing
              ? "Processing..."
              : isApplied
              ? "Applied"
              : "Interested"}
          </button>
        </a>
        <p>Rate Appartment</p>
        <StarRating userId={userContext?.userAuthData?._id} apartmentId={id} />
      </div>
    </div>
  );
};

export default OwnerDetails;
