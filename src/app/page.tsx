"use client";
import React, { Suspense, useState, useEffect } from "react";
import { SquarePenIcon } from "lucide-react"; // Importing the icon
import Hero from "@/components/HomePage/Hero";
import CategoryShowcase from "@/components/HomePage/CategoryShowcase";
import Loading from "./loading";
import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";

function Home() {
  const [showButton, setShowButton] = useState(false);

  // Handle scrolling logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen min-w-screen flex flex-col">
        <Navbar />
        <Hero />
        {/* <div className="bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]"> */}
        <div className="bg-gray-100">
          <div className="max-w-[1200px] mx-auto mt-10">
            <CategoryShowcase categories="ROOM" />
            <CategoryShowcase categories="HOSTEL" />
            <CategoryShowcase categories="PG" />
            <CategoryShowcase categories="FLAT" />
            <CategoryShowcase categories="CO-LIVING" />
          </div>
        </div>
        <Footer />
        
        {/* Add Apartment Button */}
        {showButton && (
          <button
            className="fixed bottom-8 right-5 p-3 flex justify-between items-center gap-3 px-5 text-xs bg-blue-500 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-700 animate-bounce"
            onClick={() => {
              // alert("Add Apartment button clicked!");
              window.location.href = "/test";
              // Add your logic for Add Apartment here
            }}
          >
            {/* <ArrowUpCircle className="text-2xl" /> */}
            <SquarePenIcon className="text-xs"/>
            {/* Add Apartment */}
          </button>
        )}
      </div>
    </Suspense>
  );
}

export default Home;
