"use client";
import React, { useEffect, useState } from "react";
import FlatCard from "@/components/mini/FlatCard";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  Search, 
  Frown, 
  SlidersHorizontal, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Home,
  Filter,
  TrendingUp,
  MapPin,
  Sparkles
} from "lucide-react";
import Spinner from "@/components/global/Spinner";
import { sortApartmentsForPublicList } from "@/utilis/apartmentListSort";

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
  categoryFeaturedOrder?: number;
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
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 9 items for 3x3 grid
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

        const sortedData = sortApartmentsForPublicList(response.data.data as Flat[]);

        setCategoryData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [category, router]);

  const applyFilters = () => {
    let filtered = categoryData;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter((flat) =>
        flat.apartmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flat.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flat.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // District filter
    if (district) {
      filtered = filtered.filter((flat) =>
        flat.location.toLowerCase().includes(district.toLowerCase())
      );
    }

    // Furnishing filter
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

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter((flat) => flat.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter((flat) => flat.price <= Number(priceRange.max));
    }

    // Sorting
    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "rating") {
      filtered.sort((a, b) => b.averageRating - a.averageRating);
    } else {
      filtered = sortApartmentsForPublicList(filtered);
    }

    if (filtered.length === 0) {
      toast.info("No apartments found matching your criteria.");
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearAllFilters = () => {
    setDistrict("");
    setFurnishing("all");
    setSortOrder("default");
    setPriceRange({ min: "", max: "" });
    setSearchQuery("");
    setFilteredData(categoryData);
    setCurrentPage(1);
    toast.success("All filters cleared");
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {loading ? (
        <div className="min-w-screen min-h-screen bg-white flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div>
          <Navbar />
          <div className="mx-auto max-w-[1400px] pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            {/* Compact Header with Search */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 capitalize">
                    {category} Properties
                  </h1>
                  <p className="text-xs text-gray-500">
                    {filteredData.length} properties available
                  </p>
                </div>
              </div>

              {/* Compact Search and Filter Bar */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3">
                {/* Search Bar */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && applyFilters()}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm"
                  />
                </div>

                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </span>
                    <Filter className="w-4 h-4" />
                  </button>
                </div>

                {/* Compact Filters */}
                <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
                    {/* District Filter */}
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs"
                    >
                      <option value="">All Districts</option>
                      {districtsOfRajasthan.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    {/* Furnishing Filter */}
                    <select
                      value={furnishing}
                      onChange={(e) => setFurnishing(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs"
                    >
                      <option value="all">All Types</option>
                      <option value="furnished">Furnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="not-furnished">Not Furnished</option>
                    </select>

                    {/* Price Range Min */}
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs"
                    />

                    {/* Price Range Max */}
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs"
                    />

                    {/* Sort By */}
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs"
                    >
                      <option value="default">Sort By</option>
                      <option value="lowToHigh">Price: Low to High</option>
                      <option value="highToLow">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>

                    {/* Apply Button */}
                    <button
                      onClick={applyFilters}
                      className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium text-xs flex items-center justify-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Apply
                    </button>
                  </div>

                  {/* Clear Button and Results Count */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={clearAllFilters}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all text-xs font-medium flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      Clear
                    </button>
                    
                    {filteredData.length > 0 && (
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>
                          Showing <span className="font-bold text-blue-600">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)}</span> of <span className="font-bold text-blue-600">{filteredData.length}</span>
                        </span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-semibold">
                          Page {currentPage}/{totalPages}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-6">
                  <Frown className="text-gray-400 w-20 h-20" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  No Apartments Found
                </h3>
                <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
                  We couldn&apos;t find any properties matching your criteria. Try adjusting your filters or search in another district.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Property Cards - 3 Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {currentItems.map((flat) => (
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
                      price={`${flat.price}`}
                      image={flat.image_urls[0]}
                      category={flat.category}
                      flexProp="vertical"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        currentPage === 1
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-2">
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === "number" && handlePageChange(page)}
                          disabled={page === "..."}
                          className={`min-w-[44px] h-[44px] rounded-xl font-semibold transition-all ${
                            page === currentPage
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                              : page === "..."
                              ? "text-gray-400 cursor-default"
                              : "border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        currentPage === totalPages
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}
