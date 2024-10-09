import React from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

export default function ContactUs() {
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:px-8 md:py-20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-sm text-gray-600 mb-8 text-center">
          We&apos;re Here to Help
        </p>

        <section className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-700 mb-6">
            At VRENTAL, we value your feedback and are here to assist you with
            any questions or concerns you may have. Whether you need support
            with our platform, have inquiries about listings, or want to share
            your experience with us, please don&apos;t hesitate to get in touch.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            General Inquiries
          </h2>
          <p className="text-gray-700 mb-4">
            For general questions or information about VRENTAL, please contact
            us:
            <br />
            <strong>Email:</strong> info@vrental.in
            <br />
            <strong>Mobile:</strong> +91 9509206802
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Support and Assistance
          </h2>
          <p className="text-gray-700 mb-4">
            If you need help with technical issues, account support, or have
            specific inquiries related to property listings, please reach out to
            our support team:
            <br />
            <strong>Support Email:</strong> support@vrental.in
            <br />
            <strong>Phone:</strong> +91 9509206802
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Business and Partnership Opportunities
          </h2>
          <p className="text-gray-700 mb-4">
            For business inquiries, partnership opportunities, or corporate
            collaborations, please contact:
            <br />
            <strong>Business Development Email:</strong> business@vrental.in
            <br />
            <strong>Mobile:</strong> +91 9509206802
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Feedback and Suggestions
          </h2>
          <p className="text-gray-700 mb-4">
            We&apos;re always looking to improve and would love to hear from
            you! Share your feedback or suggestions to help us enhance our
            platform:
            <br />
            <strong>Feedback Email:</strong> feedback@vrental.in
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Visit Us
          </h2>
          <p className="text-gray-700 mb-4">
            For in-person inquiries or to schedule a meeting, please contact us
            to arrange a visit.
          </p>

          <p className="text-gray-700">
            Thank you for choosing VRENTAL. We look forward to hearing from you
            and assisting you in any way we can!
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
