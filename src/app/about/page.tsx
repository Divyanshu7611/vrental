import React from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

export default function AboutUs() {
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      <Navbar />
      <main className="container mx-auto px-4 py-16 md:px-8 md:py-20">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Welcome to <span className="text-teal-600">VRental</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Launch Date: August 1, 2024
          </p>
        </header>

        <section className="bg-white p-10 rounded-xl shadow-xl mb-16 transform transition-transform duration-500 hover:scale-105">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6">
            Founder & Owner
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Welcome to VRental, your premier destination for finding and renting
            rooms, hostels, paying guest (PG) accommodations, co-living
            apartments, and flats. Launched on August 1, 2024, VRental was
            created by Kushal Gaur, a dynamic 21-year-old who is currently
            pursuing a B-Tech degree in Aeronautical Engineering at Rajasthan
            Technical University. With a vision to simplify and enhance the
            rental experience, Kushal has designed VRental to be the ultimate
            platform for those seeking quality living spaces.
          </p>
        </section>

        <section className="gap-12 mb-16">
          <div className="bg-white p-10 rounded-xl shadow-xl transform transition-transform duration-500 hover:scale-105">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Meet the Team
            </h2>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Kushal Gaur
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Founder & Owner</strong>
              </p>
              <p className="text-gray-700 leading-relaxed">
                Kushal Gaur, the 21-year-old founder of VRental, is a passionate
                innovator currently pursuing a B-Tech degree in Aeronautical
                Engineering at Rajasthan Technical University. While excelling
                in his academic field, Kushal recognized the challenges in
                finding quality rental accommodations, which inspired him to
                launch VRental on August 1, 2024. His goal is to make the rental
                process easier, more transparent, and accessible for everyone.
                <br /> <br />
                Kushal&apos;s unique blend of technical skills, creativity, and
                a deep understanding of user needs has shaped VRental into a
                platform that truly puts users first. From designing the UI/UX
                to overseeing every detail of the platform, Kushal’s hands-on
                approach ensures that VRental provides a seamless, enjoyable
                experience for both renters and property owners alike. His
                vision is to build a trusted, all-in-one rental platform where
                users can find their perfect space with confidence and ease.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Divyanshu Sharma
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Frontend & Backend Developer</strong>
              </p>
              <p className="text-gray-700 leading-relaxed">
                The technical brilliance behind VRental’s smooth functionality
                is thanks to Divyanshu Sharma. As the developer responsible for
                both the frontend and backend of the platform, Divyanshuhas
                played a crucial role in bringing Kushal’s vision to life,
                ensuring that our website is both efficient and user-friendly.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white p-10 rounded-xl shadow-xl mb-16 transform transition-transform duration-500 hover:scale-105">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            At VRental, our mission is to provide a comprehensive and
            hassle-free platform for finding and renting various types of living
            accommodations. Whether you’re searching for a private room, a cozy
            hostel, a paying guest arrangement, a shared co-living space, or a
            full-fledged flat, we are dedicated to offering detailed and
            reliable listings to help you find your perfect home.
          </p>
        </section>

        <section className="bg-white p-10 rounded-xl shadow-xl mb-16 transform transition-transform duration-500 hover:scale-105">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6">
            What We Offer
          </h2>
          <ul className="list-disc list-inside pl-5 mb-6 text-gray-600 space-y-4">
            <li>
              <strong>Room Rentals:</strong> Browse through a wide selection of
              individual rooms available for rent, each with detailed
              descriptions and high-quality images.
            </li>
            <li>
              <strong>Hostels:</strong> Find budget-friendly hostel
              accommodations that cater to your specific needs and preferences.
            </li>
            <li>
              <strong>Paying Guest (PG) Options:</strong> Explore various paying
              guest arrangements that offer convenience and affordability.
            </li>
            <li>
              <strong>Co-Living Apartments:</strong> Discover modern co-living
              spaces designed for a community-centric lifestyle.
            </li>
            <li>
              <strong>Flats and Apartments:</strong> Access detailed listings
              for flats and apartments, including amenities, location details,
              and pricing information.
            </li>
          </ul>
        </section>

        <section className="bg-white p-10 rounded-xl shadow-xl mb-16 text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6">
            Why Choose VRental?
          </h2>
          <ul className="list-disc list-inside pl-5 mb-6 text-gray-600 space-y-4">
            <li>
              <strong>Comprehensive Listings:</strong> Our platform offers
              detailed information on a diverse range of rental options, helping
              you make informed decisions.
            </li>
            <li>
              <strong>User-Friendly Design:</strong> Thanks to Kushal Gaur’s
              thoughtful UI/UX design, our website provides a seamless and
              enjoyable browsing experience.
            </li>
            <li>
              <strong>Efficient Development:</strong> Divyanshu Sharma’s
              expertise ensures that our website operates smoothly, with
              efficient navigation and reliable performance.
            </li>
            <li>
              <strong>Customer-Centric Service:</strong> We are committed to
              addressing the unique needs of each renter, offering support and
              assistance throughout your search process.
            </li>
          </ul>
        </section>

        <section className="bg-white p-10 rounded-xl shadow-xl mb-16 text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-700 mb-4 text-lg">
            We’re here to help you find your next home! If you have any
            questions or need assistance, please don’t hesitate to contact us
            through our website’s contact page.
          </p>
          <p className="text-gray-700 text-lg">
            Thank you for choosing VRental. We look forward to assisting you in
            finding the perfect living space!
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
