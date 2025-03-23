"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Rohit Sharma",
    location: "Vigyan Nagar, Kota",
    message: "Finding a good PG in Kota was a struggle, but this platform made it super easy! The listings are genuine, and the booking process is seamless.",
  },
  {
    name: "Anjali Mehta",
    location: "Talwandi, Kota",
    message: "As a student, I needed a safe and comfortable place. The site helped me find a great hostel near my coaching center with all necessary facilities.",
  },
  {
    name: "Amit Verma",
    location: "Rajeev Gandhi Nagar, Kota",
    message: "I was worried about security, but I found a well-guarded apartment thanks to this platform. Highly recommended for students in Kota!",
  },
  {
    name: "Priya Sharma",
    location: "Indraprastha Industrial Area, Kota",
    message: "Booking a flat was hassle-free, and the rent was reasonable. The website made it easy to compare and choose the best option.",
  },
];

const TestimonialSlider: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-10">
          What Our Users Say
        </h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3500 }}
          breakpoints={{
            768: { slidesPerView: 2 },
          }}
          className="pb-10"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="rounded-2xl">
              <div className="shadow-lg rounded-2xl p-6 flex flex-col justify-between transition duration-300 hover:shadow-xl border border-gray-200">
                <FaQuoteLeft className="text-blue-500 text-4xl mb-4" />
                <p className="text-gray-700 italic">{testimonial.message}</p>
                <div className="mt-6 text-right">
                  <p className="text-lg font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSlider;
