// "use client";
// import React, { useEffect, useState } from "react";
// import FlatCard from "@/components/mini/FlatCard";
// import { useSearchParams } from "next/navigation";
// import Navbar from "@/components/global/Navbar";
// import Footer from "@/components/global/Footer";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify"; // Import toast

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
//   averageRating: number;
// }

// export default function Page() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const category = searchParams.get("category");
//   const [categoryData, setCategoryData] = useState<Flat[]>([]);
//   const [filteredData, setFilteredData] = useState<Flat[]>([]);
//   const [loading, setLoading] = useState(true);

//   // State variables for filters
//   const [location, setLocation] = useState(""); // Updated to a text input for city search
//   const [furnishing, setFurnishing] = useState("all");
//   const [sortOrder, setSortOrder] = useState("default");

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

//         // Sort by averageRating in descending order
//         const sortedData = response.data.data.sort(
//           (a: Flat, b: Flat) => b.averageRating - a.averageRating
//         );

//         setCategoryData(sortedData);
//         setFilteredData(sortedData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//       setLoading(false);
//     };

//     fetchData();
//   }, [category]);

//   const applyFilters = () => {
//     let filtered = categoryData;

//     if (location) {
//       filtered = filtered.filter((flat) =>
//         flat.location.toLowerCase().includes(location.toLowerCase())
//       );
//     }

//     // Furnishing filter logic
//     filtered = filtered.filter((flat) => {
//       const facilityCount = flat.facility.split(",").length;
//       if (furnishing === "furnished") {
//         return flat.furniture && facilityCount > 5;
//       } else if (furnishing === "semi-furnished") {
//         return flat.furniture && facilityCount > 2 && facilityCount <= 5;
//       } else if (furnishing === "not-furnished") {
//         return !flat.furniture && facilityCount === 0;
//       }
//       return true; // "all" case or any unrecognized option
//     });

//     // Sorting
//     if (sortOrder === "lowToHigh") {
//       filtered.sort((a, b) => a.price - b.price);
//     } else if (sortOrder === "highToLow") {
//       filtered.sort((a, b) => b.price - a.price);
//     }

//     // If no matches are found, show all data and display a toast
//     if (filtered.length === 0) {
//       toast.info("No apartments found in the selected city and criteria.");
//       filtered = categoryData;
//     }

//     setFilteredData(filtered);
//   };

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
//       {loading ? (
//         <div className="min-w-screen min-h-screen flex justify-center items-center bg-transparent">
//           <div className="loader"></div>
//         </div>
//       ) : (
//         <div>
//           <Navbar />
//           <div className="mx-auto max-w-[1080px] pt-20 px-4">
//             <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//                 <input
//                   type="text"
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   placeholder="Search by Location"
//                   className="p-2 border rounded-md w-full"
//                 />
//                 <select
//                   value={furnishing}
//                   onChange={(e) => setFurnishing(e.target.value)}
//                   className="p-2 border rounded-md w-full"
//                 >
//                   <option value="all">All</option>
//                   <option value="furnished">Furnished</option>
//                   <option value="semi-furnished">Semi-Furnished</option>
//                   <option value="not-furnished">Not Furnished</option>
//                 </select>
//               </div>
//               <div className="flex justify-between items-center">
//                 <select
//                   value={sortOrder}
//                   onChange={(e) => setSortOrder(e.target.value)}
//                   className="p-2 border rounded-md"
//                 >
//                   <option value="default">Sort by</option>
//                   <option value="lowToHigh">Price: Low to High</option>
//                   <option value="highToLow">Price: High to Low</option>
//                 </select>
//                 <button
//                   onClick={applyFilters}
//                   className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//                 >
//                   Search
//                 </button>
//               </div>
//             </div>

//             <div className="flex-wrap flex">
//               {filteredData.map((flat, index) => (
//                 <FlatCard
//                   averageRating={flat.averageRating}
//                   key={flat._id}
//                   title={flat.apartmentName}
//                   id={flat._id}
//                   contactNo={flat.contactNo}
//                   facility={flat.facility}
//                   furnitureDescription={flat.furnitureDescription}
//                   availableFor={flat.availableFor}
//                   furniture={flat.furniture}
//                   parking={flat.parking}
//                   electricity={flat.electricity}
//                   client={flat.client}
//                   description={flat.description}
//                   location={flat.location}
//                   price={`₹${flat.price}/month`}
//                   image={flat.image_urls[0]}
//                   category={flat.category}
//                   flexProp={index % 2 === 0 ? "row" : "row-reverse"}
//                 />
//               ))}
//             </div>
//           </div>
//           <Footer />
//         </div>
//       )}
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
import { toast } from "react-toastify"; // Import toast

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
  averageRating: number;
}

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");
  const [categoryData, setCategoryData] = useState<Flat[]>([]);
  const [filteredData, setFilteredData] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);

  // State variables for filters
  const [location, setLocation] = useState(""); // Updated to a text input for city search
  const [furnishing, setFurnishing] = useState("all");
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

        // Sort by averageRating in descending order
        const sortedData = response.data.data.sort(
          (a: Flat, b: Flat) => b.averageRating - a.averageRating
        );

        setCategoryData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [category]);

  const applyFilters = () => {
    let filtered = categoryData;

    if (location) {
      filtered = filtered.filter((flat) =>
        flat.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Furnishing filter logic
    filtered = filtered.filter((flat) => {
      const facilityCount = flat.facility.split(",").length;
      if (furnishing === "furnished") {
        return flat.furniture && facilityCount > 5;
      } else if (furnishing === "semi-furnished") {
        return flat.furniture && facilityCount > 2 && facilityCount <= 5;
      } else if (furnishing === "not-furnished") {
        return !flat.furniture && facilityCount === 0;
      }
      return true; // "all" case or any unrecognized option
    });

    // Sorting
    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    // If no matches are found, show all data and display a toast
    if (filtered.length === 0) {
      toast.info("No apartments found in the selected city and criteria.");
      filtered = categoryData;
    }

    setFilteredData(filtered);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F0F4F8] to-[#D9E6F2]">
      {loading ? (
        <div className="min-w-screen min-h-screen flex justify-center items-center bg-transparent">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          <Navbar />
          <div className="mx-auto max-w-[1080px] pt-24 px-6">
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Find Your Perfect Apartment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Search by city"
                  className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="not-furnished">Not Furnished</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Sort by</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
                <button
                  onClick={applyFilters}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="flex-wrap flex justify-center gap-6">
              {filteredData.map((flat, index) => (
                <FlatCard
                  averageRating={flat.averageRating}
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
