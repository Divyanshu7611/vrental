"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CorporateOverview = () => {
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:px-8 md:py-20">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center"
        >
          VRENTAL Corporate Overview
        </motion.h1>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-700 mb-4">
            VRENTAL is an innovative rental platform launched in 2024, dedicated
            to simplifying the process of finding and renting residential
            spaces. Whether it’s a room, hostel, paying guest (PG)
            accommodation, co-living apartment, or flat, VRENTAL provides a
            comprehensive, user-friendly solution tailored to meet the needs of
            tenants and property owners alike.
          </p>
          <p className="text-gray-700 mb-4">
            With a core focus on transparency, efficiency, and customer
            satisfaction, VRENTAL operates on a simple principle: to connect
            renters with the best available living spaces without hidden costs
            or unnecessary complications.
          </p>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 mb-4">
            VRENTAL’s mission is to streamline the rental process by offering a
            trusted platform where tenants and property owners can interact
            directly. We aim to provide a hassle-free, transparent, and secure
            environment for finding and renting living accommodations, helping
            people make informed decisions and avoid common pitfalls in the
            rental market.
          </p>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Values
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li className="mb-2">
              Transparency: Open, honest communication between tenants and
              property owners.
            </li>
            <li className="mb-2">
              User-Centric Design: An intuitive platform designed for seamless
              user experiences.
            </li>
            <li className="mb-2">
              Innovation: Leveraging the latest technology to enhance
              functionality and user experience.
            </li>
            <li className="mb-2">
              Affordability: Free for property owners to list and always free
              for tenants.
            </li>
            <li>
              Community: Building a trust-based community for effective
              connections.
            </li>
          </ul>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Services
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li className="mb-2">
              Room Rentals: A broad selection of individual rooms with detailed
              descriptions.
            </li>
            <li className="mb-2">
              Hostels & PG Accommodations: Affordable hostel and PG
              accommodations tailored to your preferences.
            </li>
            <li className="mb-2">
              Co-Living Spaces: Modern, community-driven co-living apartments.
            </li>
            <li className="mb-2">
              Flats & Apartments: Comprehensive listings of flats including
              pricing and amenities.
            </li>
            <li>
              Custom Search Features: Personalized search by city, budget, and
              property type.
            </li>
            <li>
              Property Owner Tools: Easy listing, management, and updates for
              property owners.
            </li>
          </ul>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Why Partner with VRENTAL?
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li className="mb-2">
              Comprehensive Market Reach: Connecting property owners with a wide
              audience.
            </li>
            <li className="mb-2">
              High-Quality Listings: Clear and accurate listings with detailed
              property information.
            </li>
            <li className="mb-2">
              Efficient Technology: User-friendly design for a seamless browsing
              experience.
            </li>
            <li className="mb-2">
              Support & Assistance: Dedicated customer support for all users.
            </li>
            <li>
              Future-Proof Solutions: Upcoming subscription models and premium
              services.
            </li>
          </ul>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Corporate Contact Information
          </h2>
          <p className="text-gray-700 mb-2">
            For corporate inquiries, partnerships, or more information, please
            feel free to contact us:
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Email:</strong> vrental91@gmail.com
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Mobile:</strong> +91 9509206802
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Website:</strong>{" "}
            <a href="http://www.vrental.in" className="text-blue-500 underline">
              www.vrental.in
            </a>
          </p>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <p className="text-gray-700">
            Thank you for choosing VRENTAL. We are excited to partner with you
            and provide high-quality rental solutions for everyone!
          </p>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default CorporateOverview;
