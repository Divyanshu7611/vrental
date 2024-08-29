// import React from "react";
// import SmallCard from "../mini/SmallCard";
// import { useState, useEffect } from "react";
// import axios from "axios";

// const dummyData = [
//   {
//     price: 1000,
//     timePeriod: "month",
//     category: "Room",
//     address: "Vigyan Nagar, Kota, Rajasthan.",

//     image: "/assets/room.png",
//   },
//   {
//     price: 1200,
//     timePeriod: "month",
//     category: "Room",
//     address: "Talwandi, Kota, Rajasthan.",

//     image: "/assets/room.png",
//   },
//   {
//     price: 900,
//     timePeriod: "month",
//     category: "Room",
//     address: "Mahaveer Nagar, Kota, Rajasthan.",

//     image: "/assets/room.png",
//   },
//   {
//     price: 1100,
//     timePeriod: "month",
//     category: "Room",
//     address: "Indraprastha, Kota, Rajasthan.",

//     image: "/assets/room.png",
//   },
// ];

// const [filteredData, setFilteredData] = useState([]);
// const [loading, setLoading] = useState(true);

// // State variables for filters

// const [sortOrder, setSortOrder] = useState("default");

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await axios(
//         `/api/aparment/getApartment?category=${category}`
//       );
//       if (response.data.data.length === 0) {
//         router.push("/");
//       }

//       // Sort by averageRating in descending order
//       const sortedData = response.data.data.sort(
//         (a: Flat, b: Flat) => b.averageRating - a.averageRating
//       );

//       setCategoryData(sortedData);
//       setFilteredData(sortedData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//     setLoading(false);
//   };

//   fetchData();
// }, [category]);
// function CategoryShowcase({ categories }: { categories: string }) {
//   return (
//     <div className="flex flex-col h-full mx-auto mt-10">
//       <h1 className="font-bold text-4xl mx-auto lg:mx-0">{categories}</h1>
//       <div className="flex justify-between items-center lg:flex-row mt-5 flex-wrap mx-auto lg:mx-0 gap-3">
//         {dummyData.map((room, index) => (
//           <SmallCard
//             key={index}
//             price={room.price}
//             timePeriod={room.timePeriod}
//             category={room.category}
//             address={room.address}
//             image={room.image}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CategoryShowcase;
"use client";
import React, { useState, useEffect } from "react";
import SmallCard from "../mini/SmallCard";
import HomeFlat from "../mini/HomeFlat";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define the type for the data
interface Apartment {
  price: number;
  timePeriod: string;
  category: string;
  location: string;
  image_urls: string;
  averageRating: number; // Assuming you have this field for sorting
}

// Dummy data for fallback or initial rendering
const dummyData: Apartment[] = [
  {
    price: 1000,
    timePeriod: "month",
    category: "Room",
    location: "Vigyan Nagar, Kota, Rajasthan.",
    image_urls: "/assets/room.png",
    averageRating: 4.5,
  },
  {
    price: 1200,
    timePeriod: "month",
    category: "Room",
    location: "Talwandi, Kota, Rajasthan.",
    image_urls: "/assets/room.png",
    averageRating: 4.2,
  },
  {
    price: 900,
    timePeriod: "month",
    category: "Room",
    location: "Mahaveer Nagar, Kota, Rajasthan.",
    image_urls: "/assets/room.png",
    averageRating: 4.7,
  },
  {
    price: 1100,
    timePeriod: "month",
    category: "Room",
    location: "Indraprastha, Kota, Rajasthan.",
    image_urls: "/assets/room.png",
    averageRating: 4.3,
  },
];

function CategoryShowcase({ categories }: { categories: string }) {
  const [filteredData, setFilteredData] = useState<Apartment[]>(dummyData);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/aparment/getApartment?category=${categories}`
        );
        console.log("apartment Data", response);
        if (response.data.data.length === 0) {
          router.push("/");
        }

        // Sort by averageRating in descending order
        const sortedData = response.data.data.sort(
          (a: Apartment, b: Apartment) => b.averageRating - a.averageRating
        );

        setFilteredData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [categories, router]);

  return (
    <div className="flex flex-col h-full mx-auto mt-10">
      <h1 className="font-bold text-4xl mx-auto lg:mx-0">{categories}</h1>
      <div className="flex justify-between items-center lg:flex-row mt-5 flex-wrap mx-auto lg:mx-0 gap-3">
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredData
            .slice(0, 4)
            .map((room, index) => (
              <HomeFlat
                key={index}
                price={room.price}
                category={room.category}
                address={room.location}
                image={room.image_urls[0]}
                averageRating={room.averageRating}
              />
            ))
        )}
      </div>
    </div>
  );
}

export default CategoryShowcase;
