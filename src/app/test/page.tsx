"use client";
import React from "react";
import Step1 from "@/components/Form/Step1";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              List Your Property
            </h1>
            <p className="text-gray-600 text-lg">
              Fill out the form below to get started
            </p>
          </div>
          <Step1 />
        </div>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Page;
