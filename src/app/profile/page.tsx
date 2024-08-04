"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import ProfileDetails from "@/components/Profile/ProfileDetails";
import ProfileRating from "@/components/Profile/ProfileRating";
import SmallCard from "@/components/mini/SmallCard";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function page() {
  const [aparmentData, handleApartmentData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/aparment/apartments?id=${userContext?.userAuthData?._id}`
        );
        if (response) {
          setLoading(false);
          handleApartmentData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userContext?.userAuthData?._id) {
      fetchData();
    } else {
      toast.error("Please login to access this page");
      router.push("/");
    }
  }, [userContext?.userAuthData?._id]);

  return (
    <div className="bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF] min-w-screen min-h-screen">
      <Navbar />
      {loading ? (
        <div className="min-h-screen min-w-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center flex-col">
          <div className="w-full h-full flex justify-center items-center bg-[#f8ecec]">
            <ProfileDetails />
          </div>
          <div className="bg-gradient-to-b from-[#03E9F7] to-[#c9c0c0] w-full h-full px-1 py-8">
            <ProfileRating />
          </div>
          <div className="py-2 bg-gradient-to-b from-[#FFFFFF] to-[#00F0FF] w-full">
            <h1 className="text-2xl font-medium text-center">Apartments</h1>
          </div>
          <div className="p-1 w-full">
            <div className="max-w-[1080px] mx-auto flex flex-wrap justify-start items-item-start py-5 gap-5">
              {aparmentData.map(
                (data: any, index: React.Key | null | undefined) => (
                  <SmallCard
                    key={index}
                    price={data.price}
                    timePeriod="Month"
                    size="15 X 25"
                    category={data.category}
                    address={data.address}
                    date="15 JULY 2024"
                    image={data.image_urls[0]}
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
      <ToastContainer />
    </div>
  );
}
