// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { Search, MapPin, Home, IndianRupee } from "lucide-react";
// import { useRouter } from "next/navigation";

// function Hero() {
//   const router = useRouter();
//   const [searchParams, setSearchParams] = useState({
//     location: "",
//     propertyType: "",
//     budget: "",
//   });

//   const handleSearch = () => {
//     if (searchParams.propertyType) {
//       router.push(`/category?category=${searchParams.propertyType}`);
//     } else {
//       router.push("/category?category=ROOM");
//     }
//   };

//   return (
//     <div className="relative w-full overflow-hidden">
//       {/* Background Image */}
//       <div className="absolute inset-0 z-0">
//         <img
//           src="/assets/homepage.png"
//           alt="Hero Background"
//           className="w-full h-full object-cover"
//         />
//         {/* Overlay for better text readability */}
//         <div className="absolute inset-0 bg-gradient-to-r from-skyblue/60 via-white/40 to-transparent"></div>
//       </div>

//       {/* Content Container */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center min-h-[600px] lg:min-h-[700px]">
//         <div className="w-full lg:w-2/3 space-y-8">
//           {/* Hero Text */}
//           <div className="space-y-6">
//             {/* Vrental Logo & Brand */}
//             {/* <div className="flex items-center gap-4 mb-2"> */}

//               <h1 
//                 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-800 tracking-tight" 
//                 style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', letterSpacing: '-0.02em' }}
//               >
//                 Vrental
//               </h1>
//             {/* </div> */}
//             <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white leading-tight">
//               Your Perfect Home <span className="text-gray-700 font-bold">Awaits You</span>              <br />
//             </h2>
//          =
//           </div>

      

//           {/* Search Box */}
//           <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-4xl">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Search for available properties
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* Location */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Location
//                 </label>
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     placeholder="Enter location"
//                     value={searchParams.location}
//                     onChange={(e) =>
//                       setSearchParams({ ...searchParams, location: e.target.value })
//                     }
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E0FF] focus:border-transparent outline-none transition"
//                   />
//                 </div>
//               </div>

//               {/* Property Type */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Property Type
//                 </label>
//                 <div className="relative">
//                   <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <select
//                     value={searchParams.propertyType}
//                     onChange={(e) =>
//                       setSearchParams({
//                         ...searchParams,
//                         propertyType: e.target.value,
//                       })
//                     }
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E0FF] focus:border-transparent outline-none transition appearance-none bg-white"
//                   >
//                     <option value="">Select Type</option>
//                     <option value="ROOM">Room</option>
//                     <option value="HOSTEL">Hostel</option>
//                     <option value="PG">PG</option>
//                     <option value="FLAT">Flat</option>
//                     <option value="CO-LIVING">Co-Living</option>
//                     <option value="SHOP">Shop</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Budget */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Budget
//                 </label>
//                 <div className="relative">
//                   <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <select
//                     value={searchParams.budget}
//                     onChange={(e) =>
//                       setSearchParams({ ...searchParams, budget: e.target.value })
//                     }
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00E0FF] focus:border-transparent outline-none transition appearance-none bg-white"
//                   >
//                     <option value="">Select Budget</option>
//                     <option value="0-5000">₹0 - ₹5,000</option>
//                     <option value="5000-10000">₹5,000 - ₹10,000</option>
//                     <option value="10000-20000">₹10,000 - ₹20,000</option>
//                     <option value="20000+">₹20,000+</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Search Button */}
//               <div className="flex items-end">
//                 <button
//                   onClick={handleSearch}
//                   className="w-full bg-[#156f6f] hover:bg-[#00E0FF] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
//                 >
//                   <Search className="w-5 h-5" />
//                   Search Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Hero;


"use client";
import React, { useState } from "react";
import { Home, TrendingUp, Shield, Clock, Map, ArrowRight } from "lucide-react";
import NearbyApartmentsMapModal from "@/components/HomePage/NearbyApartmentsMapModal";
import { useUserLocation } from "@/context/LocationContext";

function Hero() {
  const { label } = useUserLocation();
  const [mapModalOpen, setMapModalOpen] = useState(false);

  // Animated stats
  const stats = [
    { icon: Home, value: "1000+", label: "Properties" },
    { icon: Shield, value: "100%", label: "Verified" },
    { icon: Clock, value: "24/7", label: "Support" },
  ];

  return (
    <div className="relative w-full overflow-hidden">

      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/homepage.png"
          alt="Hero Background"
          className="w-full h-full object-cover object-[center_15%] sm:object-top md:object-[center_top] brightness-95 
          animate-slow-zoom"
        />

        {/* Gradient Overlays */}
        <div className="hidden md:block absolute inset-0 
          bg-gradient-to-r from-blue-50/90 via-white/50 to-transparent">
        </div>
        <div className="md:hidden absolute inset-0 
          bg-gradient-to-b from-white/85 via-white/50 to-white/20">
        </div>

        {/* Animated Shapes — smaller on narrow screens to avoid edge bleed */}
        <div className="hidden sm:block absolute top-16 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float" />
        <div className="hidden sm:block absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
        min-h-[min(100svh,36rem)] sm:min-h-[560px] lg:min-h-[700px] flex items-center py-10 sm:py-0">

        <div className="w-full lg:w-2/3 space-y-5 sm:space-y-6">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm 
            px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-blue-700 
            animate-slide-down shadow-sm max-w-full">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="leading-snug">India&apos;s Fastest Growing Rental Platform</span>
          </div>

          {/* Main Heading with Animation */}
          <div className="space-y-2.5 sm:space-y-3 animate-slide-up">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] sm:leading-none
              bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 
              bg-clip-text text-transparent tracking-tight
              animate-gradient-x bg-[length:200%_auto]">
              VRENTAL
            </h1>

            <h2 className="text-[1.35rem] leading-snug sm:text-2xl md:text-4xl lg:text-5xl font-bold 
              text-gray-800">
              Find Your Perfect{" "}
              <span className="relative inline-block">
                <span className="text-blue-600">Home</span>
                <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1.5 sm:h-2" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0,4 Q25,0 50,4 T100,4" stroke="#3B82F6" strokeWidth="2" fill="none" 
                    className="animate-draw-line"/>
                </svg>
              </span>
              <br className="hidden sm:block" />
              <span className="text-gray-600 font-semibold sm:font-bold">In Minutes</span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Discover verified properties across India. From cozy rooms to spacious flats, 
              find your ideal space with ease.
            </p>
          </div>

          <div className="max-w-5xl w-full">
            <button
              type="button"
              onClick={() => setMapModalOpen(true)}
              className="group w-full rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-[border-color,box-shadow] hover:border-gray-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Map className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>

                <span className="min-w-0 flex-1 space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Map
                  </span>
                  <span className="block text-base font-semibold leading-snug text-gray-900 sm:text-lg">
                    See registered apartments on the map
                  </span>
                  <span className="block text-sm leading-relaxed text-gray-600">
                    {label ? (
                      <>
                        Focused around <strong className="font-semibold text-gray-800">{label}</strong>
                        <span className="text-gray-500"> — open the map to change your search area anytime.</span>
                      </>
                    ) : (
                      <>
                        Open the map and set your <strong className="font-semibold text-gray-800">city &amp; area</strong> there to focus pins, then explore listings on the map.
                      </>
                    )}
                  </span>
                </span>

                <span className="flex w-full shrink-0 sm:w-auto sm:self-stretch sm:items-center">
                  <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-blue-700 sm:w-auto sm:min-w-[7.5rem]">
                    Open map
                    <ArrowRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  </span>
                </span>
              </span>
            </button>
          </div>
          <NearbyApartmentsMapModal open={mapModalOpen} onClose={() => setMapModalOpen(false)} />

          {/* Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-8 animate-fade-in pb-2 sm:pb-0">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 
                  transition-colors group-hover:scale-110 duration-300">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-[11px] sm:text-xs md:text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Hero;
