"use client";
import React, { useState, useEffect } from "react";
import EditForm from "@/components/Form/EditApartment";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  return (
    <div className="bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF] min-w-screen min-h-screen">
      <Navbar />
      <div className="overflow-x-hidden flex justify-center items-center">
        <div className="mx-auto my-24 w-full h-full">
          <EditForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
