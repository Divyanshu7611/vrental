"use client";
import React, { useState, useEffect } from "react";
import Step1 from "@/components/Form/Step1";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  return (
    <div className="bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF] min-w-screen min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="overflow-x-hidden flex justify-center items-center">
        <div className="mx-auto my-24 w-full h-full">
          <Step1 />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
