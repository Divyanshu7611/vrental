import React from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

export default function HumanResources() {
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:px-8 md:py-20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Human Resources at VRENTAL
        </h1>
        <p className="text-sm text-gray-600 mb-8 text-center">
          Our People, Our Strength
        </p>

        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <p className="text-gray-700 mb-6">
            At VRENTAL, we believe that our people are our greatest asset. Our
            Human Resources (HR) department is dedicated to creating a
            supportive, inclusive, and dynamic work environment where innovation
            thrives and employees are empowered to excel.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            HR Mission
          </h2>
          <p className="text-gray-700 mb-4">
            The HR team at VRENTAL is focused on fostering a culture of
            collaboration, creativity, and growth. We aim to create a workplace
            where employees feel valued, inspired, and motivated to contribute
            to the company&apos;s mission.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Core HR Values
          </h2>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>
              <strong>Employee Development:</strong> Continuous learning,
              professional growth, and skill development opportunities.
            </li>
            <li>
              <strong>Inclusivity & Diversity:</strong> Embracing diversity and
              fostering a culture of equal opportunity.
            </li>
            <li>
              <strong>Work-Life Balance:</strong> Flexible schedules and remote
              work options.
            </li>
            <li>
              <strong>Collaboration & Teamwork:</strong> Encouraging open
              communication and teamwork.
            </li>
            <li>
              <strong>Recognition & Rewards:</strong> A recognition program
              highlighting individual and team achievements.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Career Opportunities
          </h2>
          <p className="text-gray-700 mb-4">
            VRENTAL offers diverse career opportunities in a dynamic and growing
            industry. Explore openings on our Careers Page and join us in
            building the future of rental solutions.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Employee Benefits
          </h2>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Health & Wellness Programs</li>
            <li>Professional Development</li>
            <li>Flexible Work Options</li>
            <li>Paid Time Off</li>
            <li>Performance Bonuses</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Join Us at VRENTAL
          </h2>
          <p className="text-gray-700 mb-4">
            If you’re looking for a workplace that values your contributions and
            fosters a positive, innovative environment, we’d love to hear from
            you. Contact us at:
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> vrental91@gmail.com
            <br />
            <strong>Mobile:</strong> +91 9509206802
            <br />
            <strong>Website:</strong> www.vrental.in
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
