// "use client";
// import React, { useContext, useEffect, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { motion, useAnimation } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import { UserContext } from "@/context/UserContext";

// // Define the FlatCardProps interface
// interface FlatCardProps {
//   id: string;
//   title: string;
//   description: string;
//   location: string;
//   price: string;
//   image: string;
//   flexProp: string;
//   category: string;
//   averageRating: number;
//   contactNo: number;
//   furnitureDescription: string;
//   parking: boolean;
//   electricity: boolean;
//   facility: string;
//   availableFor: string;
//   furniture: boolean;
//   client: string[];
// }

// const FlatCard: React.FC<FlatCardProps> = ({
//   id,
//   title,
//   description,
//   location,
//   price,
//   image,
//   flexProp,
//   category,
//   averageRating,
// }) => {
//   const controls = useAnimation();
//   const router = useRouter();
//   const { ref, inView } = useInView({
//     threshold: 0.2,
//     triggerOnce: true,
//   });

//   useEffect(() => {
//     if (inView) {
//       controls.start("visible");
//     } else {
//       controls.start("hidden");
//     }
//   }, [controls, inView]);

//   const cardVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         ease: "easeInOut",
//       },
//     },
//   };

//   const userContext = useContext(UserContext);
//   const [isInWishlist, setIsInWishlist] = useState<boolean>(false);

//   useEffect(() => {
//     if (userContext?.wishlist[id]) {
//       setIsInWishlist(true);
//     } else {
//       setIsInWishlist(false);
//     }
//   }, [userContext?.wishlist, id]);

//   const handleWishlistToggle = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (userContext?.userAuthData) {
//       const apartment = {
//         id,
//         title,
//         description,
//         location,
//         price,
//         image,
//         flexProp,
//         category,
//         averageRating,
//         contactNo: 0,
//         furnitureDescription: "",
//         parking: false,
//         electricity: false,
//         facility: "",
//         availableFor: "",
//         furniture: false,
//         client: [],
//       };

//       if (isInWishlist) {
//         userContext.removeFromWishlist(id); // Removes the apartment from the wishlist
//       } else {
//         userContext.addToWishlist(apartment); // Adds the apartment to the wishlist
//       }
//     } else {
//       // Handle the case where userContext or userAuthData is not available
//       console.error("User context or user data is not available.");
//     }
//   };

//   const handleCardClick = () => {
//     // Save the current scroll position
//     const scrollPosition = window.scrollY;
//     sessionStorage.setItem("scrollPosition", scrollPosition.toString());

//     // Navigate to the apartment details page
//     router.push(`/view?apartmentID=${id}`);
//   };

//   return (
//     <motion.div
//       ref={ref}
//       initial="hidden"
//       animate={controls}
//       variants={cardVariants}
//       whileHover={{ scale: 1.05 }}
//       // onClick={() => {
//       //   router.push(`/view?apartmentID=${id}`);
//       // }}
//       onClick={handleCardClick}
//       className={`bg-white lg:rounded-lg rounded-lg w-full max-w-[1000px] mx-auto flex flex-col-reverse justify-between ${
//         flexProp === "row" ? "lg:flex-row" : "lg:flex-row-reverse"
//       } md:flex-col-reverse mb-10`}
//     >
//       <div className="flex flex-col justify-between lg:max-h-[315px] p-5 overflow-hidden md:w-full lg:w-2/4">
//         <div className="flex flex-col gap-3">
//           <h1 className="text-2xl font-normal">{title}</h1>
//           <p className="text-sm text-black opacity-50 text-wrap">
//             {description}
//           </p>
//           <p className="text-sm text-black opacity-50">{location}</p>
//           <div className="flex items-center gap-1">
//             <p className="text-base text-black opacity-100">Rating: </p>
//             <p className="text-base text-black opacity-100">
//               {averageRating}⭐
//             </p>
//           </div>
//           <p className="text-lg text-black opacity-100">{price}</p>
//         </div>
//         <div>
//           <button
//             className={`border rounded-lg text-sm px-4 py-1 transition-all duration-200 ${
//               isInWishlist
//                 ? "bg-[#3560cb] text-white"
//                 : "bg-transparent text-[#28989e]"
//             }`}
//             onClick={handleWishlistToggle}
//           >
//             {isInWishlist ? "Remove From Wishlist" : "Add To Wishlist"}
//           </button>
//         </div>
//       </div>
//       <div className="overflow-hidden md:w-full lg:w-2/4 w-full lg:max-w-[500px] lg:max-h-[315px] max-h-[380px]">
//         <Image
//           src={image}
//           alt="flatcard"
//           height={315}
//           width={500}
//           layout="responsive"
//           objectFit="cover"
//           className="rounded-lg"
//         />
//       </div>
//     </motion.div>
//   );
// };

// export default FlatCard;


"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { UserContext } from "@/context/UserContext";
import { 
  Star, 
  MapPin, 
  Heart, 
  IndianRupee,
  Sofa,
  Zap,
  Car,
  Home,
  Eye,
  Sparkles,
  Calendar,
  BadgeCheck
} from "lucide-react";
interface FlatCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  price: string;
  image: string;
  flexProp: string;
  category: string;
  averageRating: number;
  contactNo: number
  furnitureDescription: string;
  parking: boolean;
  electricity: boolean;
  facility: string;
  availableFor: string;
  furniture: boolean;
  client: string[];  
}

const FlatCard: React.FC<FlatCardProps> = ({
  id,
  title,
  description,
  location,
  price,
  image,
  flexProp,
  category,
  averageRating,
  contactNo,
  facility,
  availableFor,
  furniture,
  furnitureDescription,
  parking,
  electricity,
  client,
}) => {
  const controls = useAnimation();
  const router = useRouter();
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const userContext = useContext(UserContext);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);

  useEffect(() => {
    if (userContext?.wishlist[id]) {
      setIsInWishlist(true);
    } else {
      setIsInWishlist(false);
    }
  }, [userContext?.wishlist, id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userContext?.userAuthData) {
      const apartment = {
        id,
        title,
        description,
        location,
        price,
        image,
        flexProp,
        category,
        averageRating,
        contactNo: 0,
        furnitureDescription: "",
        parking: false,
        electricity: false,
        facility: "",
        availableFor: "",
        furniture: false,
        client: [],
      };

      if (isInWishlist) {
        userContext.removeFromWishlist(id);
      } else {
        userContext.addToWishlist(apartment);
      }
    } else {
      console.error("User context or user data is not available.");
    }
  };

  const handleCardClick = () => {
    const scrollPosition = window.scrollY;
    sessionStorage.setItem("scrollPosition", scrollPosition.toString());
    router.push(`/apartment?apartmentID=${id}`);
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  // Parse facilities
  const facilities = facility ? facility.split(",").map(f => f.trim()).filter(f => f) : [];
  const displayFacilities = facilities.slice(0, 3);
  const remainingCount = facilities.length - 3;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      className={`bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 w-full overflow-hidden border border-gray-100 cursor-pointer group relative flex flex-col ${
        flexProp === "vertical" ? "h-full" : `max-w-[1100px] mx-auto ${flexProp === "row" ? "lg:flex-row" : "lg:flex-row-reverse"}`
      }`}
    >
      {/* Image Section */}
      <div className={`relative w-full overflow-hidden ${
        flexProp === "vertical" ? "h-[200px]" : "h-[240px] lg:w-[40%] lg:h-[280px]"
      }`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Save listing (heart) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isInWishlist ? "Remove from saved listings" : "Save listing"}
          title={isInWishlist ? "Remove from saved" : "Save listing"}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-sm transition-all duration-300 z-10 ${
            isInWishlist
              ? "bg-red-500 text-white"
              : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart 
            size={18} 
            className={`transition-all ${isInWishlist ? "fill-white" : ""}`}
          />
        </button>

        {/* Rating Badge */}
        {averageRating > 0 && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Location Bar */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-1.5 text-white">
            <MapPin size={12} className="flex-shrink-0" />
            <p className="text-xs font-medium truncate">{location}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={`flex flex-col p-4 ${
        flexProp === "vertical" ? "flex-1" : "lg:w-[60%] lg:p-5"
      }`} onClick={handleCardClick}>
        {/* Title and Category */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h2 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 ${
              flexProp === "vertical" ? "text-base" : "text-xl lg:text-2xl"
            }`}>
              {title}
            </h2>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0">
              {category}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1">
            <IndianRupee size={18} className="text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{price}</span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-3">
          {furniture && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md">
              <Sofa size={14} className="text-gray-600" />
              <span className="text-xs text-gray-700">Furnished</span>
            </div>
          )}
          
          {parking && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md">
              <Car size={14} className="text-gray-600" />
              <span className="text-xs text-gray-700">Parking</span>
            </div>
          )}
          
          {electricity && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md">
              <Zap size={14} className="text-gray-600" />
              <span className="text-xs text-gray-700">Power</span>
            </div>
          )}

          {facilities.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md">
              <Sparkles size={14} className="text-gray-600" />
              <span className="text-xs text-gray-700">{facilities.length} Facilities</span>
            </div>
          )}
        </div>

        {/* View Button */}
        <button
          onClick={handleCardClick}
          className="mt-auto w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <span>View Details</span>
          <Eye size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default FlatCard;
