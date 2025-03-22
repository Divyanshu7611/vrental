"use client";
import React, { useEffect, useState } from "react";
import FlatCard from "@/components/mini/FlatCard";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Search, Frown } from "lucide-react";

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

const districtsOfRajasthan = [
  "Jaipur",
  "Jodhpur",
  "Udaipur",
  "Ajmer",
  "Kota",
  "Bikaner",
  "Alwar",
  "Bharatpur",
  "Pali",
  "Sikar",
  "Churu",
  "Tonk",
  "Barmer",
  "Jaisalmer",
];

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");
  const [categoryData, setCategoryData] = useState<Flat[]>([]);
  const [filteredData, setFilteredData] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);

  // State variables for filters
  const [district, setDistrict] = useState("");
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

    if (district) {
      filtered = filtered.filter((flat) =>
        flat.location.toLowerCase().includes(district.toLowerCase())
      );
    }

    filtered = filtered.filter((flat) => {
      const facilityCount = flat.facility.split(",").length;
      if (furnishing === "furnished") {
        return flat.furniture && facilityCount > 5;
      } else if (furnishing === "semi-furnished") {
        return flat.furniture && facilityCount > 2 && facilityCount <= 5;
      } else if (furnishing === "not-furnished") {
        return !flat.furniture && facilityCount === 0;
      }
      return true;
    });

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (filtered.length === 0) {
      toast.info("No apartments found in the selected district and criteria.");
    }

    setFilteredData(filtered);
  };

  return (
    <div className="w-full min-h-screen">
      {loading ? (
        <div className="min-w-screen min-h-screen flex justify-center items-center">
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
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select District</option>
                  {districtsOfRajasthan.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
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
                  <Search className="inline mr-2" />
                  Search
                </button>
              </div>
            </div>

            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Frown className="text-gray-500 w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Apartments Found
                </h3>
                <p className="text-gray-600 text-center">
                  Try adjusting your filters or search in another district.
                </p>
              </div>
            ) : (
              <div className="flex-wrap flex justify-center gap-6">
                {filteredData.map((flat, index) => (
                  <FlatCard
                    averageRating={flat.averageRating}
                    key={flat._id}
                    title={flat.apartmentName}
                    id={flat._id}
                    facility={flat.facility}
                    contactNo={flat.contactNo}
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
            )}
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}
