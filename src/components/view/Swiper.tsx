"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

interface SwipperProps {
  images: string[];
}

const Swipper: React.FC<SwipperProps> = ({ images }) => {
  return (
    <Swiper
      pagination={{
        type: "fraction",
      }}
      navigation={true}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      modules={[Pagination, Navigation, Autoplay]}
      className="mySwiper"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index} className="h-[474px]">
          <div className="relative w-full h-full">
            <Image
              src={image}
              height={474}
              width={1024}
              loading={index === 0 ? "eager" : "lazy"}
              priority={index === 0}
              alt={`Slide ${index + 1}`}
              className="w-full max-h-[474px] object-cover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Swipper;
