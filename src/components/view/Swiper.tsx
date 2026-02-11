// "use client";
// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import Image from "next/image";
// import { Pagination, Navigation, Autoplay } from "swiper/modules";

// interface SwipperProps {
//   images: string[];
// }

// const Swipper: React.FC<SwipperProps> = ({ images }) => {
//   return (
//     <Swiper
//       pagination={{
//         type: "fraction",
//       }}
//       navigation={true}
//       autoplay={{ delay: 2500, disableOnInteraction: false }}
//       modules={[Pagination, Navigation, Autoplay]}
//       className="mySwiper"
//     >
//       {images.map((image, index) => (
//         <SwiperSlide
//           key={index}
//           className="flex justify-center items-center rounded-xl"
//         >
//           <div className="relative w-full lg:h-[474px] h-[374px] max-h-[474px]">
//             <Image
//               src={image}
//               fill
//               loading={index === 0 ? "eager" : "lazy"}
//               priority={index === 0}
//               alt={`Slide ${index + 1}`}
//               className="object-cover h-full rounded-xl"
//             />
//           </div>
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   );
// };

// export default Swipper;


"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

interface ImageGridProps {
  images: string[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const remainingCount = images.length - 3;

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        document.body.style.overflow = "unset";
      }
      if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === "ArrowLeft") {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, images.length]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">
        
        {/* LEFT BIG IMAGE */}
        <div 
          className="relative lg:col-span-2 h-[300px] lg:h-[474px] cursor-pointer group"
          onClick={() => openModal(0)}
        >
          <Image
            src={images[0]}
            alt="Main Image"
            fill
            priority
            className="object-cover rounded-xl transition-transform"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all" />
        </div>

        {/* RIGHT SIDE IMAGES */}
        <div className="grid grid-rows-2 gap-3 h-[300px] lg:h-[474px]">
          
          {/* TOP RIGHT IMAGE */}
          {images[1] && (
            <div 
              className="relative cursor-pointer group"
              onClick={() => openModal(1)}
            >
              <Image
                src={images[1]}
                alt="Image 2"
                fill
                className="object-cover rounded-xl transition-transform"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all" />
            </div>
          )}

          {/* BOTTOM RIGHT IMAGE */}
          {images[2] && (
            <div 
              className="relative cursor-pointer group"
              onClick={() => openModal(2)}
            >
              <Image
                src={images[2]}
                alt="Image 3"
                fill
                className="object-cover rounded-xl transition-transform"
              />

              {/* OVERLAY IF MORE IMAGES - Clickable */}
              {remainingCount > 0 && (
                <div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl hover:bg-black/60 transition-all cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(2);
                  }}
                >
                  <div className="text-center">
                    <span className="text-white text-2xl font-semibold block">
                      +{remainingCount}
                    </span>
                    <span className="text-white text-sm mt-1 block">
                      View all photos
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FULL SCREEN MODAL GALLERY */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
            aria-label="Close gallery"
          >
            <IoClose className="w-8 h-8" />
          </button>

          {/* Main Image Container */}
          <div 
            className="relative w-full h-full flex items-center justify-center px-16 py-24"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentImageIndex]}
              alt={`Gallery image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              priority
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-3 hover:bg-white/10 rounded-full z-10"
                  aria-label="Previous image"
                >
                  <IoChevronBack className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-3 hover:bg-white/10 rounded-full z-10"
                  aria-label="Next image"
                >
                  <IoChevronForward className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Controls Container */}
          <div className="absolute bottom-0 left-0 right-0 pb-4">
            {/* Image Counter */}
            <div className="text-center mb-3">
              <div className="inline-block text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div 
                className="flex gap-2 max-w-4xl mx-auto overflow-x-auto px-4 justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-white scale-110"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGrid;