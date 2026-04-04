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
import React, { useState, useEffect } from "react";
import { Search, MapPin, Home, IndianRupee, TrendingUp, Shield, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

function Hero() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    location: "",
    propertyType: "",
    budget: "",
  });

  const handleSearch = () => {
    if (searchParams.propertyType) {
      router.push(`/category?category=${searchParams.propertyType}`);
    } else {
      router.push("/category?category=ROOM");
    }
  };

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
          className="w-full h-full object-cover object-top md:object-[center_top] brightness-95 
          animate-slow-zoom"
        />

        {/* Gradient Overlays */}
        <div className="hidden md:block absolute inset-0 
          bg-gradient-to-r from-blue-50/90 via-white/50 to-transparent">
        </div>
        <div className="md:hidden absolute inset-0 
          bg-gradient-to-b from-white/80 via-white/40 to-transparent">
        </div>

        {/* Animated Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
        min-h-[600px] lg:min-h-[700px] flex items-center">

        <div className="w-full lg:w-2/3 space-y-6">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm 
            px-4 py-2 rounded-full text-sm font-medium text-blue-700 
            animate-slide-down shadow-sm">
            <TrendingUp className="w-4 h-4" />
            <span>India&apos;s Fastest Growing Rental Platform</span>
          </div>

          {/* Main Heading with Animation */}
          <div className="space-y-3 animate-slide-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black 
              bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 
              bg-clip-text text-transparent tracking-tight
              animate-gradient-x bg-[length:200%_auto]">
              VRENTAL
            </h1>

            <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold 
              text-gray-800 leading-tight">
              Find Your Perfect{" "}
              <span className="relative inline-block">
                <span className="text-blue-600">Home</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8">
                  <path d="M0,4 Q25,0 50,4 T100,4" stroke="#3B82F6" strokeWidth="2" fill="none" 
                    className="animate-draw-line"/>
                </svg>
              </span>
              <br className="hidden sm:block" />
              <span className="text-gray-600">In Minutes</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
              Discover verified properties across India. From cozy rooms to spacious flats, 
              find your ideal space with ease.
            </p>
          </div>

          {/* Enhanced Search Box */}
          <div className="backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl p-3 sm:p-4 max-w-5xl 
            transition-all duration-300 hover:shadow-3xl border border-white/60
            animate-slide-up-delayed">

            <div className="flex flex-col lg:flex-row gap-3 lg:gap-2 lg:items-center">

              {/* Location */}
              <div className="flex-1 relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 
                  text-blue-500 w-4 h-4 group-focus-within:text-cyan-600 
                  group-focus-within:scale-110 transition-all" />
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={searchParams.location}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      location: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl 
                  border border-gray-200 bg-white/80
                  hover:border-blue-300 hover:bg-white hover:shadow-md
                  focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                  focus:shadow-lg
                  transition-all duration-200 outline-none
                  text-sm placeholder:text-gray-500"
                />
              </div>

              {/* Property Type */}
              <div className="flex-1 relative group">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 
                  text-blue-500 w-4 h-4 pointer-events-none z-10
                  group-focus-within:text-cyan-600 group-focus-within:scale-110 transition-all" />
                <select
                  value={searchParams.propertyType}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      propertyType: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl 
                  border border-gray-200 bg-white/80
                  hover:border-blue-300 hover:bg-white hover:shadow-md
                  focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                  focus:shadow-lg
                  transition-all duration-200 outline-none appearance-none
                  text-sm cursor-pointer
                  bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] 
                  bg-[length:1em] bg-[right_0.5rem_center] bg-no-repeat"
                >
                  <option value="">Property Type</option>
                  <option value="ROOM">Room</option>
                  <option value="HOSTEL">Hostel</option>
                  <option value="PG">PG</option>
                  <option value="FLAT">Flat</option>
                  <option value="CO-LIVING">Co-Living</option>
                  <option value="SHOP">Shop</option>
                </select>
              </div>

              {/* Budget */}
              <div className="flex-1 relative group">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 
                  text-blue-500 w-4 h-4 pointer-events-none z-10
                  group-focus-within:text-cyan-600 group-focus-within:scale-110 transition-all" />
                <select
                  value={searchParams.budget}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      budget: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl 
                  border border-gray-200 bg-white/80
                  hover:border-blue-300 hover:bg-white hover:shadow-md
                  focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 
                  focus:shadow-lg
                  transition-all duration-200 outline-none appearance-none
                  text-sm cursor-pointer
                  bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] 
                  bg-[length:1em] bg-[right_0.5rem_center] bg-no-repeat"
                >
                  <option value="">Budget</option>
                  <option value="0-5000">₹0 - ₹5K</option>
                  <option value="5000-10000">₹5K - ₹10K</option>
                  <option value="10000-20000">₹10K - ₹20K</option>
                  <option value="20000+">₹20K+</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="lg:w-auto w-full bg-gradient-to-r from-blue-600 to-cyan-500 
                hover:from-blue-700 hover:to-cyan-600
                active:scale-95
                text-white font-semibold py-2.5 px-6 rounded-xl 
                transition-all duration-200 
                flex items-center justify-center gap-2 
                shadow-lg hover:shadow-xl hover:-translate-y-0.5
                relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                  translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Search</span>
              </button>

            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 sm:gap-8 animate-fade-in">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 
                  transition-colors group-hover:scale-110 duration-300">
                  <stat.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
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
