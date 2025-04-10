"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface FlatCardProps {
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
  flexProp: string;
  category: string;
}

const FlatCard: React.FC<FlatCardProps> = ({
  title,
  description,
  location,
  price,
  image,
  flexProp,
  category,
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

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      className={`bg-white lg:rounded-lg w-full mx-auto flex justify-between ${
        flexProp === "row" ? "lg:flex-row" : "lg:flex-row-reverse"
      } flex-col-reverse mb-10`}
    >
      <div className="flex flex-col justify-between lg:max-h-[315px] p-5">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-normal">{title}</h1>
          <p className="text-sm text-black opacity-50">{description}</p>
          <p className="text-sm text-black opacity-50">{location}</p>
          <p className="text-base text-black opacity-100">{price}</p>
        </div>
        <div>
          <button className="border border-[#1FA5AD] bg-transparent rounded-lg text-[#1FA5AD] text-sm px-4 py-1 hover:scale-105 transition-all duration-200">
            View {category.toLowerCase()}
          </button>
        </div>
      </div>
      <div className="max-w-[500px] max-h-[315px] overflow-hidden">
        <Image
          src={image}
          alt="flatcard"
          height={315}
          width={500}
          className="max-w-[500px] max-h-[315px] rounded-lg"
        />
      </div>
    </motion.div>
  );
};

export default FlatCard;
