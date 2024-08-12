// // "use client";
// // import React, { useEffect, useState } from "react";
// // import FlatCard from "@/components/mini/FlatCard";
// // import { useSearchParams } from "next/navigation";
// // import axios from "axios";

// // interface Flat {
// //   title: string;
// //   description: string;
// //   location: string;
// //   price: string;
// //   image: string;
// //   Category: string;
// // }

// // export default function Page() {
// //   const searchParams = useSearchParams();
// //   const category = searchParams.get("category");
// //   const [categoryData, setCategoryData] = useState<Flat[]>([]);

// //   useEffect(() => {
// //     if (!category) {
// //       window.location.href = "/?category=ROOM";
// //       return;
// //     }
// //     const fetchData = async () => {
// //       try {
// //         const response = await axios(
// //           `/api/aparment/getApartment?category=${category}`
// //         );
// //         setCategoryData(response.data);
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //       }
// //     };

// //     fetchData();
// //   }, [category]);

// //   return (
// //     <div className="flex justify-center w-full min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
// //       <div className="mx-auto max-w-[1200px] flex-wrap flex">
// //         {categoryData.map((flat, index) => (
// //           <FlatCard
// //             key={index}
// //             title={flat.title}
// //             description={flat.description}
// //             location={flat.location}
// //             price={flat.price}
// //             image={flat.image}
// //             category={flat.Category}
// //             flexProp={index % 2 === 0 ? "flex-row-reverse" : "flex-row"}
// //           />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import React, { useEffect, useState } from "react";
// import FlatCard from "@/components/mini/FlatCard";
// import { useSearchParams } from "next/navigation";
// import Navbar from "@/components/global/Navbar";
// import Footer from "@/components/global/Footer";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// interface Flat {
//   _id: string;
//   apartmentName: string;
//   location: string;
//   image_urls: string[];
//   description: string;
//   price: number;
//   contactNo: number;
//   furnitureDescription: string;
//   availableFor: string;
//   facility: string;
//   client: string[];
//   furniture: boolean;
//   parking: boolean;
//   electricity: boolean;
//   category: string;
//   flexProp: string;
// }

// export default function Page() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const category = searchParams.get("category");
//   const [categoryData, setCategoryData] = useState<Flat[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!category) {
//       router.push("/");
//     }
//     const fetchData = async () => {
//       try {
//         const response = await axios(
//           `/api/aparment/getApartment?category=${category}`
//         );
//         if (response.data.data.length === 0) {
//           router.push("/");
//         }
//         setCategoryData(response.data.data); // Accessing the `data` key in the response
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//       setLoading(false);
//     };

//     fetchData();
//   }, [category]);

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
//       <Navbar />
//       {loading ? (
//         <div className="min-w-sceen min-h-screen flex justify-center items-center">
//           <div className="loader"></div>
//         </div>
//       ) : (
//         <div className="mx-auto max-w-[1200px] flex-wrap flex pt-20">
//           {categoryData.map((flat, index) => (
//             <FlatCard
//               key={flat._id}
//               title={flat.apartmentName}
//               id={flat._id}
//               contactNo={flat.contactNo}
//               facility={flat.facility}
//               furnitureDescription={flat.furnitureDescription}
//               availableFor={flat.availableFor}
//               furniture={flat.furniture}
//               parking={flat.parking}
//               electricity={flat.electricity}
//               client={flat.client}
//               description={flat.description}
//               location={flat.location}
//               price={`₹${flat.price}/month`}
//               image={flat.image_urls[0]}
//               category={flat.category}
//               flexProp={index % 2 === 0 ? "row" : "row-reverse"}
//             />
//           ))}
//         </div>
//       )}
//       <Footer />
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import FlatCard from "@/components/mini/FlatCard";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Flat {
  _id: string;
  apartmentName: string;
  location: string;
  image_urls: string[];
  description: string;
  price: number;
  contactNo: number;
  furnitureDescription: string;
  availableFor: string;
  facility: string;
  client: string[];
  furniture: boolean;
  parking: boolean;
  electricity: boolean;
  category: string;
  flexProp: string;
}

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");
  const [categoryData, setCategoryData] = useState<Flat[]>([]);
  const [filteredData, setFilteredData] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);

  // State variables for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    if (!category) {
      router.push("/");
    }
    const fetchData = async () => {
      try {
        const response = await axios(
          `/api/aparment/getApartment?category=${category}`
        );
        if (response.data.data.length === 0) {
          router.push("/");
        }
        setCategoryData(response.data.data);
        setFilteredData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [category]);

  const applyFilters = () => {
    let filtered = categoryData;

    if (searchTerm) {
      filtered = filtered.filter(
        (flat) =>
          flat.apartmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          flat.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter((flat) =>
        flat.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter((flat) => flat.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((flat) => flat.price <= parseInt(maxPrice));
    }

    // Sorting
    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredData(filtered);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      {loading ? (
        <div className="min-w-screen min-h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          <Navbar />
          <div className="mx-auto max-w-[1080px] pt-20 px-4">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search apartments"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border rounded-md w-full"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="p-2 border rounded-md w-full"
                />
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="p-2 border rounded-md w-full"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="p-2 border rounded-md w-full"
                />
              </div>
              <div className="flex justify-between items-center">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="default">Sort by</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
                <button
                  onClick={applyFilters}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="flex-wrap flex">
              {filteredData.map((flat, index) => (
                <FlatCard
                  key={flat._id}
                  title={flat.apartmentName}
                  id={flat._id}
                  contactNo={flat.contactNo}
                  facility={flat.facility}
                  furnitureDescription={flat.furnitureDescription}
                  availableFor={flat.availableFor}
                  furniture={flat.furniture}
                  parking={flat.parking}
                  electricity={flat.electricity}
                  client={flat.client}
                  description={flat.description}
                  location={flat.location}
                  price={`₹${flat.price}/month`}
                  image={flat.image_urls[0]}
                  category={flat.category}
                  flexProp={index % 2 === 0 ? "row" : "row-reverse"}
                />
              ))}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}
