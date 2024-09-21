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
        <SwiperSlide
          key={index}
          className="flex justify-center items-center rounded-xl"
        >
          <div className="relative w-full lg:h-[474px] h-[374px] max-h-[474px]">
            <Image
              src={image}
              fill
              loading={index === 0 ? "eager" : "lazy"}
              priority={index === 0}
              alt={`Slide ${index + 1}`}
              className="object-cover h-full rounded-xl"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Swipper;
