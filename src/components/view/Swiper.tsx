// "use client";
// import React, { useRef, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// import "./styles.css";
// import { Pagination, Navigation } from "swiper/modules";

// export default function Swipper() {
//   return (
//     <>
//       <Swiper
//         pagination={{
//           type: "fraction",
//         }}
//         navigation={true}
//         modules={[Pagination, Navigation]}
//         className="mySwiper"
//       >
//         <SwiperSlide>Slide 1</SwiperSlide>
//         <SwiperSlide>Slide 2</SwiperSlide>
//         <SwiperSlide>Slide 3</SwiperSlide>
//         <SwiperSlide>Slide 4</SwiperSlide>
//         <SwiperSlide>Slide 5</SwiperSlide>
//         <SwiperSlide>Slide 6</SwiperSlide>
//         <SwiperSlide>Slide 7</SwiperSlide>
//         <SwiperSlide>Slide 8</SwiperSlide>
//         <SwiperSlide>Slide 9</SwiperSlide>
//       </Swiper>
//     </>
//   );
// }

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
              objectFit="cover"
              alt={`Slide ${index + 1}`}
              className="w-full max-h-[474px]"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Swipper;
