"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin } from 'lucide-react';

interface FlatCardProps {
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
  flexProp: string;
  category: string;
}

const ModernFlatCard: React.FC<FlatCardProps> = ({
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
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden w-full mx-auto flex justify-between ${
        flexProp === "row" ? "lg:flex-row" : "lg:flex-row-reverse"
      } flex-col-reverse mb-10 hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex flex-col justify-between lg:max-h-[315px] p-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-5 h-5" />
            <span className="text-base">{location}</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">₹{price}</span>
            <span className="text-gray-600 text-lg">/month</span>
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg px-6 py-3 transition-all duration-200 hover:shadow-md">
            View {category.toLowerCase()}
          </button>
        </div>
      </div>
      <div className="lg:w-1/2 relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          height={315}
          width={500}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    </motion.div>
  );
};

export default ModernFlatCard;