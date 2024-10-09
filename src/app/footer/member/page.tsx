import React from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

export default function MemberAgreement() {
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:px-8 md:py-20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          VRENTAL Member Agreement
        </h1>
        <p className="text-sm text-gray-600 mb-8 text-center">
          Effective Date: 1ST AUGUST 2024
        </p>

        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Registration and Membership
          </h2>
          <p className="text-gray-700 mb-4">
            To become a member of VRENTAL, you must create an account by
            providing accurate, current, and complete registration details.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Use of the Platform
          </h2>
          <p className="text-gray-700 mb-4">
            As a member, you are granted a non-exclusive, limited right to
            access and use the platform for posting and searching for rental
            properties.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. Member Responsibilities
          </h2>
          <p className="text-gray-700 mb-4">
            Property Owners: You agree to provide accurate, current, and
            truthful information about the properties you list.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. Posting Content
          </h2>
          <p className="text-gray-700 mb-4">
            Members may post property listings, reviews, and other relevant
            content on the platform. All content must be accurate and truthful.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Membership Fees
          </h2>
          <p className="text-gray-700 mb-4">
            Currently, membership on VRENTAL is free. We may introduce paid
            features or subscriptions in the future.
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
