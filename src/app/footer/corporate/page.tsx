import React from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

export default function PostingGuidelines() {
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:px-8 md:py-20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          VRENTAL Posting Guidelines
        </h1>
        <p className="text-sm text-gray-600 mb-8 text-center">
          A Guide for Posting on VRENTAL
        </p>

        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Authentic Listings Only
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>Owners:</strong> Post only genuine and available properties.
            False, duplicate, or misleading listings are not allowed.
            <br />
            <strong>Tenants:</strong> Avoid posting incorrect information or
            inquiries for unavailable or off-topic properties.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Complete and Accurate Information
          </h2>
          <p className="text-gray-700 mb-4">
            Provide complete details about the property, including location,
            rent, amenities, and any specific terms. Use up-to-date photos of
            the property.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. No Spam or Irrelevant Content
          </h2>
          <p className="text-gray-700 mb-4">
            Refrain from posting the same property multiple times. Duplicate
            postings will be removed. Avoid advertising unrelated services or
            products.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. Respectful Communication
          </h2>
          <p className="text-gray-700 mb-4">
            Be polite and professional in your interactions with other users.
            Offensive or inappropriate language will not be tolerated.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Rental Prices and Fees
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>Owners:</strong> Clearly mention rent, security deposits,
            and any additional fees. Hidden charges are not allowed.
            <br />
            <strong>Tenants:</strong> Understand all costs before engaging with
            the owner to avoid disputes later.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            6. Timely Updates
          </h2>
          <p className="text-gray-700 mb-4">
            Update your listing status as soon as the property is no longer
            available. This ensures the platform remains current for all users.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            7. Compliance with Local Laws
          </h2>
          <p className="text-gray-700 mb-4">
            Ensure that your listing complies with the relevant laws and
            regulations governing property rentals in your area.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            8. No Third-Party Postings
          </h2>
          <p className="text-gray-700 mb-4">
            Listings should only be posted by property owners or their verified
            representatives. No third-party or broker postings are allowed.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            9. Prohibited Listings
          </h2>
          <p className="text-gray-700 mb-4">
            Illegal properties, unauthorized sublets, or properties that violate
            local housing rules cannot be posted.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Let’s Work Together to Keep VRENTAL Safe!
          </h2>
          <p className="text-gray-700">
            Failure to comply with these guidelines may result in the removal of
            your listing and suspension of your account.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
