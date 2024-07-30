import React from "react";
import SmallCard from "../mini/SmallCard";

const dummyData = [
  {
    price: 1000,
    timePeriod: "month",
    category: "Room",
    address: "Vigyan Nagar, Kota, Rajasthan.",
    date: "15-July-2024",
    size: "15X15",
    image: "/assets/room.png",
  },
  {
    price: 1200,
    timePeriod: "month",
    category: "Room",
    address: "Talwandi, Kota, Rajasthan.",
    date: "20-July-2024",
    size: "12X12",
    image: "/assets/room.png",
  },
  {
    price: 900,
    timePeriod: "month",
    category: "Room",
    address: "Mahaveer Nagar, Kota, Rajasthan.",
    date: "18-July-2024",
    size: "14X14",
    image: "/assets/room.png",
  },
  {
    price: 1100,
    timePeriod: "month",
    category: "Room",
    address: "Indraprastha, Kota, Rajasthan.",
    date: "22-July-2024",
    size: "16X16",
    image: "/assets/room.png",
  },
];

function CategoryShowcase({ categories }: { categories: string }) {
  return (
    <div className="flex flex-col h-full mx-auto mt-10">
      <h1 className="font-bold text-4xl mx-auto lg:mx-0">{categories}</h1>
      <div className="flex justify-between items-center lg:flex-row mt-5 flex-wrap mx-auto lg:mx-0 gap-3">
        {dummyData.map((room, index) => (
          <SmallCard
            key={index}
            price={room.price}
            timePeriod={room.timePeriod}
            category={room.category}
            address={room.address}
            date={room.date}
            size={room.size}
            image={room.image}
          />
        ))}
      </div>
    </div>
  );
}

export default CategoryShowcase;
