import React from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

export default function TermsOfUse() {
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:px-8 md:py-20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          VRENTAL Terms of Use
        </h1>
        <p className="text-sm text-gray-600 mb-8 text-center">
          Effective Date: 1 AUGUST 2024
        </p>

        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 mb-4">
            By using VRENTAL, you acknowledge that you have read, understood,
            and agreed to these Terms of Use. If you do not agree to these
            terms, please refrain from using the platform.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Scope of Service
          </h2>
          <p className="text-gray-700 mb-4">
            VRENTAL is a platform that connects tenants with property owners
            offering rental accommodations, such as rooms, PGs, hostels,
            co-living spaces, and flats. We do not own or control the properties
            listed on our platform.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. User Eligibility
          </h2>
          <p className="text-gray-700 mb-4">
            You must be at least 18 years old to use the platform. You agree to
            provide accurate, current, and complete information during
            registration and keep your account information updated.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. User Responsibilities
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>Owners:</strong> You agree to provide truthful and accurate
            details about your property, including photos, rent, and terms of
            rental.
            <br />
            <strong>Tenants:</strong> You agree to review all property details
            carefully before entering into any rental agreements.
            <br />
            Both owners and tenants are responsible for complying with local
            laws and regulations related to renting and leasing properties.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Prohibited Activities
          </h2>
          <p className="text-gray-700 mb-4">
            You agree not to post false or misleading information, engage in
            illegal activities, impersonate others, distribute spam or harmful
            content, or attempt unauthorized access to the platform or others’
            accounts.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            6. Account Security
          </h2>
          <p className="text-gray-700 mb-4">
            You are responsible for maintaining the confidentiality of your
            account information, including your password. Any activity conducted
            through your account will be your responsibility.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            7. Property Listings
          </h2>
          <p className="text-gray-700 mb-4">
            VRENTAL reserves the right to remove any listing that violates these
            terms, appears fraudulent, or breaches local housing laws. Property
            owners are responsible for ensuring their listing details are
            accurate and up-to-date.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            8. Fees and Payments
          </h2>
          <p className="text-gray-700 mb-4">
            While VRENTAL is free for tenants, we may introduce subscription
            fees or other charges for property owners in the future. Owners will
            be notified of any changes to pricing or subscription models before
            they take effect.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            9. Termination of Service
          </h2>
          <p className="text-gray-700 mb-4">
            VRENTAL reserves the right to suspend or terminate your account if
            you breach these Terms of Use or engage in any prohibited activity.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            10. Limitation of Liability
          </h2>
          <p className="text-gray-700 mb-4">
            VRENTAL is not responsible for the accuracy, quality, or legality of
            properties listed or the conduct of property owners or tenants. We
            act as an intermediary platform and are not a party to rental
            agreements or disputes.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            11. Dispute Resolution
          </h2>
          <p className="text-gray-700 mb-4">
            In the event of a dispute between a property owner and a tenant,
            VRENTAL encourages both parties to resolve the matter directly.
            VRENTAL is not liable for mediating or settling disputes.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            12. Changes to the Terms of Use
          </h2>
          <p className="text-gray-700 mb-4">
            VRENTAL reserves the right to modify or update these Terms of Use at
            any time. You will be notified of any significant changes via email
            or through the platform.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            13. Privacy Policy
          </h2>
          <p className="text-gray-700 mb-4">
            By using VRENTAL, you also agree to our{" "}
            <a
              href="insert_privacy_policy_link"
              className="text-blue-600 underline"
            >
              Privacy Policy
            </a>
            , which outlines how we collect, use, and protect your personal
            information.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            14. Governing Law
          </h2>
          <p className="text-gray-700 mb-4">
            These Terms of Use shall be governed by and construed in accordance
            with the laws of India. Any disputes shall be subject to the
            exclusive jurisdiction of the courts in Kota, Rajasthan.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            15. Contact Us
          </h2>
          <p className="text-gray-700">
            If you have any questions, please contact us at:
            <br />
            <strong>Email:</strong>{" "}
            <a
              href="mailto:vrental91@gmail.com"
              className="text-blue-600 underline"
            >
              vrental91@gmail.com
            </a>
            <br />
            <strong>Phone:</strong> 9509206802
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
