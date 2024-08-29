"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";

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
      className="p-2 border flex flex-col bg-white justify-between gap-5 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer mx-auto"
    >
      <div>
        <Image
          src={image}
          alt={`${category} image`}
          width={265}
          height={165}
          quality={100}
          className="lg:w-[265px] lg:h-[200px] md:w-[285px] md:h-[165px] h-[225px] w-[325px]"
        />
      </div>
      <div className="flex flex-col justify-between gap-2">
        <h1 className="font-medium text-2xl">{price}₹/Month</h1>
        <h3 className="text-sm">{category} for Rent</h3>
        <h3 className="text-[10px] text-[#000000] opacity-50 max-w-[270px]">
          {address}
        </h3>
        <h3 className="text-[10px] text-[#000000] opacity-50">
          Rating:{averageRating}
        </h3>
      </div>
    </motion.div>
  );
};

export default SmallCard;
