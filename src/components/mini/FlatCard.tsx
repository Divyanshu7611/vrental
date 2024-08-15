// "use client";
// import React, { useContext, useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { motion, useAnimation } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import { UserContext } from "@/context/UserContext";

// interface FlatCardProps {
//   title: string;
//   description: string;
//   location: string;
//   price: string;
//   image: string;
//   flexProp: string;
//   category: string;
//   id: string;
//   contactNo: number;
//   furnitureDescription: string;
//   parking: boolean;
//   electricity: boolean;
//   facility: string;
//   availableFor: string;
//   furniture: boolean;
//   client: string[];
//   averageRating: number;
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
//   return (
//     <motion.div
//       ref={ref}
//       initial="hidden"
//       animate={controls}
//       variants={cardVariants}
//       whileHover={{ scale: 1.05 }}
//       onClick={() => {
//         router.push(`/view?apartmentID=${id}`);
//       }}
//       className={`bg-white lg:rounded-lg rounded-lg w-full lg:max-w-[1000px] mx-auto flex justify-between ${
//         flexProp === "row" ? "lg:flex-row" : "lg:flex-row-reverse"
//       } flex-col-reverse mb-10`}
//     >
//       <div className="flex flex-col justify-between lg:max-h-[315px] p-5">
//         <div className="flex flex-col gap-3">
//           <h1 className="text-2xl font-normal">{title}</h1>
//           <p className="text-sm text-black opacity-50">{description}</p>
//           <p className="text-sm text-black opacity-50">{location}</p>
//           <div className="flex items-center gap-1">
//             <p className="text-base text-black opacity-100">Rating: </p>
//             <p className="text-base text-black opacity-100">{averageRating}</p>
//           </div>
//           <p className="text-lg text-black opacity-100">{price}</p>
//         </div>
//         <div>
//           <button
//             className="border border-[#1FA5AD] bg-transparent rounded-lg text-[#1FA5AD] text-sm px-4 py-1 hover:scale-105 transition-all duration-200"
//             // onClick={() => {
//             //   router.push(`/view?apartmentID=${id}`);
//             // }}
//             onClick={(e) => {
//               e.stopPropagation(); // Prevents triggering the card's onClick
//               userContext?.addToWishlist(id); // Adds the apartment to the wishlist
//             }}
//           >
//             Add To Wishlist
//           </button>
//         </div>
//       </div>
//       <div className="max-w-[500px] max-h-[315px] overflow-hidden">
//         <Image
//           src={image}
//           alt="flatcard"
//           height={315}
//           width={500}
//           className="max-w-[500px] max-h-[315px] rounded-lg"
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

// Define the FlatCardProps interface
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
  contactNo: number;
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
}) => {
  const controls = useAnimation();
  const router = useRouter();
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

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
    e.stopPropagation(); // Prevents triggering the card's onClick
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
        contactNo: 0, // Default value, update as needed
        furnitureDescription: "",
        parking: false,
        electricity: false,
        facility: "",
        availableFor: "",
        furniture: false,
        client: [],
      };

      if (isInWishlist) {
        userContext.removeFromWishlist(id); // Removes the apartment from the wishlist
      } else {
        userContext.addToWishlist(apartment); // Adds the apartment to the wishlist
      }
    } else {
      // Handle the case where userContext or userAuthData is not available
      console.error("User context or user data is not available.");
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      onClick={() => {
        router.push(`/view?apartmentID=${id}`);
      }}
      className={`bg-white lg:rounded-lg rounded-lg w-full lg:max-w-[1000px] mx-auto flex justify-between ${
        flexProp === "row" ? "lg:flex-row" : "lg:flex-row-reverse"
      } flex-col-reverse mb-10`}
    >
      <div className="flex flex-col justify-between lg:max-h-[315px] p-5">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-normal">{title}</h1>
          <p className="text-sm text-black opacity-50">{description}</p>
          <p className="text-sm text-black opacity-50">{location}</p>
          <div className="flex items-center gap-1">
            <p className="text-base text-black opacity-100">Rating: </p>
            <p className="text-base text-black opacity-100">{averageRating}</p>
          </div>
          <p className="text-lg text-black opacity-100">{price}</p>
        </div>
        <div>
          <button
            className={`border rounded-lg text-sm px-4 py-1 transition-all duration-200 ${
              isInWishlist
                ? "bg-[#FF6347] text-white"
                : "bg-transparent text-[#1FA5AD]"
            }`}
            onClick={handleWishlistToggle}
          >
            {isInWishlist ? "Remove From Wishlist" : "Add To Wishlist"}
          </button>
        </div>
      </div>
      <div className="max-w-[500px] max-h-[315px] overflow-hidden">
        <Image
          src={image}
          alt="flatcard"
          height={315}
          width={500}
          layout="intrinsic" // Or use "fill" if you want the image to fill the container
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
    </motion.div>
  );
};

export default FlatCard;
