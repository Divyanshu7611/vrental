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
import { Star, MapPin, Heart, HeartOff, DollarSign } from "lucide-react"; // Importing Lucide icons
import { IndianRupee } from "lucide-react"; // Importing Indian Rupee icon
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
    router.push(`/view?apartmentID=${id}`);
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

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      whileHover={{ y: -8 }}
      onClick={handleCardClick}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full overflow-hidden border border-gray-100 cursor-pointer group ${
        flexProp === "row" ? "lg:flex-row" : "lg:flex-row-reverse"
      } flex flex-col-reverse`}
    >
      {/* Content Section */}
      <div className="flex flex-col justify-between lg:w-1/2 p-6 lg:p-8">
        <div className="flex flex-col gap-4 mb-4">
          {/* Title and Category Badge */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
              {title}
            </h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold whitespace-nowrap">
              {category}
            </span>
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={18} className="text-blue-600 flex-shrink-0" />
            <p className="text-sm font-medium truncate">{location}</p>
          </div>
          
          {/* Rating and Price Row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-900">
                  {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <IndianRupee size={20} className="text-green-600" />
              <p className="text-xl font-bold text-green-600">{price}</p>
            </div>
          </div>
        </div>
        
        {/* Wishlist Button */}
        <button
          className={`w-full rounded-lg text-sm font-semibold px-4 py-3 transition-all duration-200 flex items-center justify-center gap-2 ${
            isInWishlist
              ? "bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100"
              : "bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100"
          }`}
          onClick={handleWishlistToggle}
        >
          {isInWishlist ? (
            <>
              <HeartOff size={18} className="fill-red-600" /> Remove from Wishlist
            </>
          ) : (
            <>
              <Heart size={18} /> Add to Wishlist
            </>
          )}
        </button>
      </div>
      
      {/* Image Section */}
      <div className="relative lg:w-1/2 w-full h-[280px] lg:h-[350px] overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

export default FlatCard;
