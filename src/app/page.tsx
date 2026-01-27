"use client";
import React, { Suspense, useState, useEffect } from "react";
import { SquarePenIcon } from "lucide-react";
import Hero from "@/components/HomePage/Hero";
import Loading from "./loading";
import FeaturesSection from "@/components/HomePage/Featured";
import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";
import TestimonialSlider from "@/components/HomePage/Testimonials";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, MapPin, Tag, Home as HomeIcon } from "lucide-react";

interface Apartment {
  _id: string;
  price: number;
  timePeriod: string;
  category: string;
  location: string;
  image_urls: string[];
  averageRating: number;
}

const categories = ["ROOM", "HOSTEL", "PG", "FLAT", "CO-LIVING"];

const SkeletonCard = () => (
  <div className="p-4 border flex flex-col bg-white justify-between gap-5 rounded-2xl shadow-lg w-full h-[450px]">
    <div className="bg-gray-200 animate-pulse h-[280px] w-full rounded-xl relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
        style={{
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      ></div>
    </div>
    <div className="flex flex-col justify-between gap-3">
      <div className="bg-gray-200 animate-pulse h-8 w-3/4 rounded"></div>
      <div className="bg-gray-200 animate-pulse h-5 w-1/2 rounded"></div>
      <div className="bg-gray-200 animate-pulse h-4 w-full rounded"></div>
      <div className="bg-gray-200 animate-pulse h-4 w-1/4 rounded"></div>
    </div>
  </div>
);

function Home() {
  const [showButton, setShowButton] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ROOM");
  const [categoryData, setCategoryData] = useState<Record<string, Apartment[]>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const hasFetchedRef = React.useRef<Record<string, boolean>>({});

  // Handle scrolling logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch data for a specific category only once
  const fetchCategoryData = React.useCallback(async (category: string) => {
    // Check if already fetched or currently fetching
    if (hasFetchedRef.current[category] || categoryData[category]) {
      return;
    }

    // Mark as fetching
    hasFetchedRef.current[category] = true;
    setLoading(true);

    try {
      const response = await axios.get(
        `/api/aparment/getApartment?category=${category}`
      );

      const sortedData = response.data.data.sort(
        (a: Apartment, b: Apartment) => b.averageRating - a.averageRating
      );

      // Store data in cache
      setCategoryData((prev) => ({
        ...prev,
        [category]: sortedData,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set empty array on error to prevent retry
      setCategoryData((prev) => ({
        ...prev,
        [category]: [],
      }));
    } finally {
      setLoading(false);
    }
  }, [categoryData]);

  // Load initial category (ROOM) on mount - only once
  useEffect(() => {
    fetchCategoryData("ROOM");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - runs only once on mount

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchCategoryData(category);
  };

  // Get current filtered data
  const filteredData = categoryData[selectedCategory] || [];

  const EnhancedCard = ({ apartment }: { apartment: Apartment }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        onClick={() => router.push(`/view?apartmentID=${apartment._id}`)}
        className="group relative p-5 border border-gray-200 flex flex-col bg-white justify-between gap-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer w-full overflow-hidden"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-2xl pointer-events-none"></div>

        {/* Image Section */}
        <div className="relative w-full h-[280px] overflow-hidden rounded-xl">
          <Image
            src={apartment.image_urls[0]}
            alt={`${apartment.category} image`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <span className="text-xs font-semibold text-gray-800 flex items-center gap-1">
              <HomeIcon size={14} className="text-blue-500" />
              {apartment.category}
            </span>
          </div>
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-yellow-400/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-md">
            <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <Star size={14} fill="currentColor" />
              {apartment.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 font-bold text-3xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              <Tag size={24} className="text-blue-500" />
              ₹{apartment.price}
              <span className="text-sm font-normal text-gray-500">/month</span>
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <MapPin size={18} className="text-green-500 flex-shrink-0" />
              <span className="line-clamp-2">{apartment.location}</span>
            </p>
          </div>

          {/* View Details Button */}
          <div className="mt-2 pt-4 border-t border-gray-100">
            <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 flex items-center gap-2">
              View Details
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen min-w-screen flex flex-col">
        <Navbar />
        <Hero />
        <div className="bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Category Section */}
            <div className="mb-12">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Find Your Perfect Space
              </motion.h2>
              <p className="text-center text-gray-600 mb-8 text-lg">
                Browse through our curated collection of properties
              </p>

              {/* Category Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 shadow-md ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                        : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* Cards Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {loading
                    ? Array(3)
                        .fill(0)
                        .map((_, index) => <SkeletonCard key={index} />)
                    : filteredData.slice(0, 3).map((apartment) => (
                        <EnhancedCard
                          key={apartment._id}
                          apartment={apartment}
                        />
                      ))}
                </motion.div>
              </AnimatePresence>

              {/* See All Link */}
              {!loading && filteredData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mt-10"
                >
                  <a
                    href={`/category?category=${selectedCategory}`}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    View All {selectedCategory} Properties
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </motion.div>
              )}

              {/* No Data Message */}
              {!loading && filteredData.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    No properties found
                  </h3>
                  <p className="text-gray-500">
                    Check back soon for new {selectedCategory} listings!
                  </p>
                </motion.div>
              )}
            </div>

            {/* Everything You Need Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="my-16"
            >
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold mb-3 text-gray-900"
                >
                  Everything You Need to{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Find Your Perfect Home
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 text-base max-w-2xl mx-auto"
                >
                  From searching to settling in, we provide all the tools and support you need
                </motion.p>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Large Card - Top Left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="relative md:row-span-2 h-[240px] md:h-auto rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070"
                    alt="Easy Property Search"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Easy Property Search</h3>
                    <p className="text-gray-200 text-xs leading-relaxed">
                      Browse thousands of verified properties with advanced filters
                    </p>
                  </div>
                </motion.div>

                {/* Top Right Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative h-[180px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073"
                    alt="Instant Booking"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
                    <p className="text-gray-100 text-xs leading-relaxed">
                      Book your favorite property instantly with just a few clicks
                    </p>
                  </div>
                </motion.div>

                {/* Bottom Right Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="relative h-[180px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2088"
                    alt="Dedicated Support"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Dedicated Support</h3>
                    <p className="text-gray-100 text-xs leading-relaxed">
                      24/7 expert assistance for your rental journey
                    </p>
                  </div>
                </motion.div>

                {/* Bottom Left Card - Full Width on Mobile */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="relative md:col-span-2 h-[180px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070"
                    alt="Secure Booking"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-900/85 via-orange-800/60 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center p-6 md:p-8">
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-3xl shadow-lg border-2 border-white/30">
                          🔒
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-white">Secure Booking</h3>
                        <p className="text-gray-100 text-sm leading-relaxed">
                          Book with confidence using our secure payment system and verified property listings
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Why Choose Us Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="my-20"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative h-[400px] lg:h-auto">
                    <Image
                      src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070"
                      alt="Beautiful property"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      Discover What Sets Us Apart
                    </motion.h2>

                    <div className="space-y-6">
                      {[
                        {
                          icon: "🏠",
                          title: "Wide Range of Properties",
                          description: "From budget-friendly PGs to luxury apartments, find exactly what you need",
                        },
                        {
                          icon: "✓",
                          title: "Verified Listings",
                          description: "All properties are verified and authenticated for your peace of mind",
                        },
                        {
                          icon: "💰",
                          title: "Best Price Guarantee",
                          description: "Competitive pricing with transparent costs and no hidden fees",
                        },
                        {
                          icon: "🤝",
                          title: "24/7 Support",
                          description: "Our dedicated team is always ready to assist you with any queries",
                        },
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-start gap-4 group"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push("/about")}
                      className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-fit"
                    >
                      Learn More About Us
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            <FeaturesSection />
            <TestimonialSlider />
          </div>
        </div>
        <Footer />

        {/* Add Apartment Button */}
        {showButton && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-5 p-4 flex justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            onClick={() => {
              window.location.href = "/test";
            }}
          >
            <SquarePenIcon className="w-6 h-6" />
          </motion.button>
        )}
      </div>
    </Suspense>
  );
}

export default Home;
