// "use client";
// import React, { useEffect } from "react";
// import Image from "next/image";
// import { motion, useAnimation } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import { useRouter } from "next/navigation";

// interface ICardDetails {
//   id: string;
//   price: number;
//   category: string;
//   address: string;
//   image: string;
//   averageRating: number;
// }

// const SmallCard: React.FC<ICardDetails> = ({
//   id,
//   price,
//   category,
//   address,
//   image,
//   averageRating,
// }) => {
//   const controls = useAnimation();
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
//   const router = useRouter();
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
//       className="p-2 border flex flex-col bg-white justify-between gap-5 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer mx-auto"
//     >
//       <div>
//         <Image
//           src={image}
//           alt={`${category} image`}
//           width={265}
//           height={165}
//           quality={100}
//           className="lg:w-[265px] lg:h-[200px] md:w-[285px] md:h-[165px] h-[225px] w-[325px]"
//         />
//       </div>
//       <div className="flex flex-col justify-between gap-2">
//         <h1 className="font-medium text-2xl">{price}₹/Month</h1>
//         <h3 className="text-sm">{category} for Rent</h3>
//         <h3 className="text-[10px] text-[#000000] opacity-50 max-w-[270px]">
//           {address}
//         </h3>
//         <h3 className="text-[10px] text-[#000000] opacity-50">
//           Rating:{averageRating}
//         </h3>
//       </div>
//     </motion.div>
//   );
// };

// export default SmallCard;


"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { Star, MapPin, Tag } from "lucide-react";

interface ICardDetails {
  id: string;
  price: number;
  category: string;
  address: string;
  image: string;
  averageRating: number;
}

const SmallCard: React.FC<ICardDetails> = ({
  id,
  price,
  category,
  address,
  image,
  averageRating,
}) => {
  const controls = useAnimation();
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

  const router = useRouter();

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
      className="p-2 border shadow-md flex flex-col bg-white justify-between gap-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer mx-auto max-w-xs"
    >
      {/* Image Section */}
      <div className="relative w-full h-[200px] overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={`${category} image`}
        
          objectFit="cover"
          width={265}
          height={165}
          quality={100}
          className="hover:scale-105 transition-transform duration-300 lg:w-[265px] lg:h-[200px] md:w-[285px] md:h-[165px] h-[225px] w-[325px]"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-3">
        <h1 className="flex items-center gap-2 font-semibold text-xl text-gray-800">
          <Tag size={20} className="text-blue-500" />
          {price}₹/Month
        </h1>

        <h3 className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={18} className="text-green-500" />
          {category} for Rent
        </h3>

        <p className="flex items-center gap-2 text-xs text-gray-500 truncate max-w-[270px]">
          <MapPin size={16} className="text-gray-400" />
          {address}
        </p>

        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Star size={16} className="text-yellow-500" />
          <span>Rating: {Math.round(averageRating)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SmallCard;
