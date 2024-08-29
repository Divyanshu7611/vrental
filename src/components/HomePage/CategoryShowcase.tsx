// "use client";
// import React, { useState, useEffect } from "react";
// import SmallCard from "../mini/SmallCard";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// // Define the type for the data
// interface Apartment {
//   _id: string;
//   price: number;
//   timePeriod: string;
//   category: string;
//   location: string;
//   image_urls: string;
//   averageRating: number; // Assuming you have this field for sorting
// }

// // Dummy data for fallback or initial rendering

// function CategoryShowcase({ categories }: { categories: string }) {
//   const [filteredData, setFilteredData] = useState<Apartment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `/api/aparment/getApartment?category=${categories}`
//         );
//         console.log("apartment Data", response);
//         if (response.data.data.length === 0) {
//           router.push("/");
//         }

//         // Sort by averageRating in descending order
//         const sortedData = response.data.data.sort(
//           (a: Apartment, b: Apartment) => b.averageRating - a.averageRating
//         );

//         setFilteredData(sortedData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//       setLoading(false);
//     };

//     fetchData();
//   }, [categories, router]);

//   return (
//     <div className="flex flex-col h-full mx-auto mt-10 mb-5">
//       <h1 className="font-bold text-4xl mx-auto lg:mx-0">{categories}</h1>
//       <div className="flex justify-between items-center lg:flex-row mt-5 flex-wrap mx-auto lg:mx-0 gap-3">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           filteredData
//             .slice(0, 4)
//             .map((room, index) => (
//               <SmallCard
//                 key={index}
//                 id={room._id}
//                 price={room.price}
//                 category={room.category}
//                 address={room.location}
//                 image={room.image_urls[0]}
//                 averageRating={room.averageRating}
//               />
//             ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default CategoryShowcase;

"use client";
import React, { useState, useEffect } from "react";
import SmallCard from "../mini/SmallCard";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Apartment {
  _id: string;
  price: number;
  timePeriod: string;
  category: string;
  location: string;
  image_urls: string[];
  averageRating: number;
}

const SkeletonCard = () => (
  <div className="p-2 border flex flex-col bg-white justify-between gap-5 rounded-lg mx-auto w-[265px] h-[350px]">
    <div className="bg-gray-200 animate-pulse h-[200px] w-full rounded-lg relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
        style={{
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      ></div>
    </div>
    <div className="flex flex-col justify-between gap-2">
      <div className="bg-gray-200 animate-pulse h-6 w-3/4 rounded"></div>
      <div className="bg-gray-200 animate-pulse h-4 w-1/2 rounded"></div>
      <div className="bg-gray-200 animate-pulse h-3 w-full rounded"></div>
      <div className="bg-gray-200 animate-pulse h-3 w-1/4 rounded"></div>
    </div>
  </div>
);

function CategoryShowcase({ categories }: { categories: string }) {
  const [filteredData, setFilteredData] = useState<Apartment[]>([]);
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
    <div className="flex flex-col h-full mx-auto mt-10 mb-5">
      <div className="flex w-full justify-between items-end">
        <h1 className="font-bold text-4xl mx-auto lg:mx-0">{categories}</h1>
        {/* <h1 className="font-medium text-sm mx-auto lg:mx-0">See all</h1> */}
      </div>
      <div className="flex justify-between items-center lg:flex-row mt-5 flex-wrap mx-auto lg:mx-0 gap-3">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          : filteredData
              .slice(0, 4)
              .map((room, index) => (
                <SmallCard
                  key={index}
                  id={room._id}
                  price={room.price}
                  category={room.category}
                  address={room.location}
                  image={room.image_urls[0]}
                  averageRating={room.averageRating}
                />
              ))}
      </div>
      <a
        className="font-normal text-blue-900 text-sm lg:mx-0 mt-3 hover:underline hover:text-blue-600 ml-1"
        href={`/category?category=${categories}`}
      >
        See all
      </a>
    </div>
  );
}

export default CategoryShowcase;
