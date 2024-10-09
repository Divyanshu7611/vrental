"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const PageNotFound = () => {
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF] flex flex-col justify-between">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:px-8 md:py-20">
        <motion.div
          initial="initial"
          animate="animate"
          variants={pageVariants}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            404
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            Oops! Page Not Found
          </p>
          <p className="text-gray-700 mb-6">
            The page you are looking for does not exist or has been moved.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Go Back Home
          </a>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PageNotFound;
