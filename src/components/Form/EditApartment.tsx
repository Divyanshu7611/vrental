"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "@/context/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/global/Spinner";
import {
  FaTv,
  FaSnowflake,
  FaFan,
  FaWifi,
  FaBreadSlice,
  FaFire,
  FaBroom,
  FaCouch,
  FaBed,
  FaChair,
  FaBook,
  FaDoorOpen,
  FaLaptop,
  FaGraduationCap,
} from "react-icons/fa";
import { IoMdCube } from "react-icons/io";
import { MdTableRestaurant, MdCoffee } from "react-icons/md";
import { GiWashingMachine, GiCooler } from "react-icons/gi";
import { BiSolidTv, BiFridge } from "react-icons/bi";
import { BsBox } from "react-icons/bs";
import { Home, Users, User, Heart, Users2, Building2, Store } from "lucide-react";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";
import GoogleMapPicker from "./GoogleMapPicker";

type FormValues = {
  apartmentName: string;
  description: string;
  price: number;
  contactNo: number;
  category: string;
  availableFor: string;
};

// Icon mappings
const facilityIcons: { [key: string]: React.ReactNode } = {
  Television: <FaTv className="w-5 h-5" />,
  TV: <FaTv className="w-5 h-5" />,
  Refrigerator: <BiFridge className="w-5 h-5" />,
  Microwave: <IoMdCube className="w-5 h-5" />,
  Toaster: <FaBreadSlice className="w-5 h-5" />,
  Oven: <FaFire className="w-5 h-5" />,
  "Washing Machine": <GiWashingMachine className="w-5 h-5" />,
  "Air Conditioner": <FaSnowflake className="w-5 h-5" />,
  Cooler: <GiCooler className="w-5 h-5" />,
  Fan: <FaFan className="w-5 h-5" />,
  "Vacuum Cleaner": <FaBroom className="w-5 h-5" />,
  Wifi: <FaWifi className="w-5 h-5" />,
};

const furnitureIcons: { [key: string]: React.ReactNode } = {
  Sofa: <FaCouch className="w-5 h-5" />,
  Bed: <FaBed className="w-5 h-5" />,
  "Dining Table": <MdTableRestaurant className="w-5 h-5" />,
  "Coffee & Tea Table": <MdCoffee className="w-5 h-5" />,
  Dressing: <FaDoorOpen className="w-5 h-5" />,
  Chair: <FaChair className="w-5 h-5" />,
  Bookshelf: <FaBook className="w-5 h-5" />,
  Wardrobe: <FaDoorOpen className="w-5 h-5" />,
  Desk: <FaLaptop className="w-5 h-5" />,
  "TV Stand": <BiSolidTv className="w-5 h-5" />,
  Nightstand: <BsBox className="w-5 h-5" />,
  "Study Table": <FaGraduationCap className="w-5 h-5" />,
};

const getIcon = (item: string, type: "facility" | "furniture"): React.ReactNode => {
  const iconMap = type === "facility" ? facilityIcons : furnitureIcons;
  if (iconMap[item]) return iconMap[item];
  const normalizedItem = item.trim();
  const key = Object.keys(iconMap).find(
    (k) => k.toLowerCase() === normalizedItem.toLowerCase()
  );
  return key ? iconMap[key] : null;
};

const EditApartment: React.FC = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const searchParams = useSearchParams();
  const apartmentId = searchParams.get("id");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({ mode: "onChange" });

  const selectedCategory = watch("category");
  const selectedAvailableFor = watch("availableFor");

  const [step, setStep] = useState(1);
  const totalSteps = 3; // No payment step for edit

  const [facilities, setFacilities] = useState<string[]>([]);
  const [furnitures, setFurniture] = useState<string[]>([]);

  const [localAddress, setLocalAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [mapLat, setMapLat] = useState<number | undefined>(undefined);
  const [mapLng, setMapLng] = useState<number | undefined>(undefined);

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const nextStep = () => step < totalSteps && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/auth");
    }
  }, []);

  useEffect(() => {
    if (token && apartmentId) {
      fetchApartment();
    }
  }, [token, apartmentId]);

  const fetchApartment = async () => {
    if (!apartmentId) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `/api/aparment/profileApartment?id=${apartmentId}`
      );
      const apartment = response.data.data;

      // Set form values
      setValue("apartmentName", apartment.apartmentName || "");
      setValue("description", apartment.description || "");
      setValue("price", apartment.price || 0);
      setValue("contactNo", apartment.contactNo || 0);
      setValue("category", apartment.category || "");
      setValue("availableFor", apartment.availableFor || "");

      // Set facilities and furniture
      setFacilities(apartment.facility ? apartment.facility.split(", ") : []);
      setFurniture(apartment.furniture ? apartment.furniture.split(", ") : []);

      // Parse location
      if (apartment.location) {
        const locationParts = apartment.location.split(", ");
        if (locationParts.length >= 4) {
          const pincodeValue = locationParts[locationParts.length - 1];
          const stateValue = locationParts[locationParts.length - 2];
          const cityValue = locationParts[locationParts.length - 3];
          const addressValue = locationParts.slice(0, -3).join(", ");
          
          setLocalAddress(addressValue);
          setCity(cityValue);
          setState(stateValue);
          setPincode(pincodeValue);
        }
      }

      // Set coordinates if available
      if (apartment.coordinates) {
        setMapLat(apartment.coordinates.latitude);
        setMapLng(apartment.coordinates.longitude);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch apartment:", error);
      setLoading(false);
      toast.error("Failed to fetch apartment data");
    }
  };

  const handleRemoveFacility = (facility: string) => {
    setFacilities(facilities.filter((f) => f !== facility));
  };

  const handleRemoveFurniture = (furniture: string) => {
    setFurniture(furnitures.filter((f) => f !== furniture));
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("apartmentName", data.apartmentName);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("contactNo", data.contactNo.toString());
      formData.append("facility", facilities.join(", "));
      formData.append("furniture", furnitures.join(", "));
      formData.append(
        "location",
        `${localAddress}, ${city}, ${state}, ${pincode}`
      );
      
      // Add coordinates if available
      if (mapLat && mapLng) {
        formData.append("latitude", mapLat.toString());
        formData.append("longitude", mapLng.toString());
        console.log("Coordinates added to update:", { lat: mapLat, lng: mapLng });
      }
      
      formData.append("availableFor", data.availableFor);
      formData.append("category", data.category);

      const response = await axios.put(
        `/api/aparment/updateApartments?id=${apartmentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        toast.success("Apartment updated successfully!");
        router.push("/profile");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update apartment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[1200px] mx-auto px-4">
      {/* Step Indicator */}
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-4 relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div
              className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>

          {[
            { num: 1, label: "Basic Info" },
            { num: 2, label: "Location" },
            { num: 3, label: "Details" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 ${
                  step >= s.num
                    ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg scale-110"
                    : "bg-white border-2 border-gray-300 text-gray-500"
                }`}
              >
                {step > s.num ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  s.num
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  step >= s.num ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 space-y-6">
        {/* STEP 1 - Basic Information */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apartment Name *
                </label>
                <input
                  {...register("apartmentName", { required: "Apartment name is required" })}
                  placeholder="e.g., Raman Villa"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {errors.apartmentName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.apartmentName.message as string}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    {...register("contactNo", { required: "Contact number is required" })}
                    placeholder="9854761278"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {errors.contactNo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactNo.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rent per Month (₹) *
                  </label>
                  <input
                    type="number"
                    {...register("price", { required: "Price is required" })}
                    placeholder="5000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.price.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: "ROOM", label: "Room", icon: <Home className="w-6 h-6" /> },
                    { value: "PG", label: "PG", icon: <Building2 className="w-6 h-6" /> },
                    { value: "HOSTEL", label: "Hostel", icon: <Users className="w-6 h-6" /> },
                    { value: "CO-LIVING", label: "Co-Living", icon: <Users2 className="w-6 h-6" /> },
                    { value: "FLAT", label: "Flat", icon: <Home className="w-6 h-6" /> },
                    { value: "SHOP", label: "Shop", icon: <Store className="w-6 h-6" /> },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setValue("category", cat.value, { shouldValidate: true })}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedCategory === cat.value
                          ? "border-blue-600 bg-blue-50 shadow-md scale-105"
                          : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className={`mb-2 ${selectedCategory === cat.value ? "text-blue-600" : "text-gray-600"}`}>
                        {cat.icon}
                      </div>
                      <span className={`text-sm font-semibold ${selectedCategory === cat.value ? "text-blue-600" : "text-gray-700"}`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="hidden"
                  {...register("category", { required: "Category is required" })}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.category.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Available For *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: "Boys", label: "Boys", icon: <User className="w-6 h-6" /> },
                    { value: "Girls", label: "Girls", icon: <User className="w-6 h-6" /> },
                    { value: "Family", label: "Family", icon: <Users className="w-6 h-6" /> },
                    { value: "Couple", label: "Couple", icon: <Heart className="w-6 h-6" /> },
                    { value: "Any", label: "Any", icon: <Users2 className="w-6 h-6" /> },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue("availableFor", option.value, { shouldValidate: true })}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedAvailableFor === option.value
                          ? "border-blue-600 bg-blue-50 shadow-md scale-105"
                          : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className={`mb-2 ${selectedAvailableFor === option.value ? "text-blue-600" : "text-gray-600"}`}>
                        {option.icon}
                      </div>
                      <span className={`text-sm font-semibold ${selectedAvailableFor === option.value ? "text-blue-600" : "text-gray-700"}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="hidden"
                  {...register("availableFor", { required: "Available for is required" })}
                />
                {errors.availableFor && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.availableFor.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Next →
              </button>
            </div>
          </>
        )}

        {/* STEP 2 - Location */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Location Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Location * (Google Maps)
                </label>
                <GooglePlacesAutocomplete
                  value={localAddress}
                  onChange={(value) => setLocalAddress(value)}
                  onPlaceSelected={(place) => {
                    setLocalAddress(place.address);
                    setCity(place.city);
                    setState(place.state);
                    setPincode(place.pincode);
                    setMapLat(place.lat);
                    setMapLng(place.lng);
                  }}
                  placeholder="Search for your property location..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Start typing to see location suggestions from Google Maps
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Jaipur"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g., Rajasthan"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g., 302001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            {/* Google Map Picker */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📍 Mark Location on Map
              </h3>
              <GoogleMapPicker
                onLocationSelect={(location) => {
                  setLocalAddress(location.address);
                  setCity(location.city);
                  setState(location.state);
                  setPincode(location.pincode);
                  setMapLat(location.lat);
                  setMapLng(location.lng);
                }}
                initialLat={mapLat || 26.9124}
                initialLng={mapLng || 75.7873}
                externalLat={mapLat}
                externalLng={mapLng}
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Next →
              </button>
            </div>
          </>
        )}

        {/* STEP 3 - Details */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Edit Property Details</h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register("description", { required: true })}
                placeholder="Describe your property in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={5}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  Description is required
                </p>
              )}
            </div>

            {/* Facilities Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Electronics & Facilities (Select Multiple)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  "Television",
                  "Refrigerator",
                  "Microwave",
                  "Toaster",
                  "Oven",
                  "Washing Machine",
                  "Air Conditioner",
                  "Cooler",
                  "Fan",
                  "Vacuum Cleaner",
                  "Wifi",
                ].map((facility) => {
                  const isSelected = facilities.includes(facility);
                  const icon = getIcon(facility, "facility");
                  return (
                    <button
                      key={facility}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          handleRemoveFacility(facility);
                        } else {
                          setFacilities([...facilities, facility]);
                        }
                      }}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 shadow-md scale-105"
                          : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className={`mb-2 ${isSelected ? "text-blue-600" : "text-gray-600"}`}>
                        {icon || <FaTv className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs font-semibold text-center ${isSelected ? "text-blue-600" : "text-gray-700"}`}>
                        {facility}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {facilities.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-700 mb-2">
                    Selected ({facilities.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium"
                      >
                        {getIcon(facility, "facility")}
                        <span>{facility}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(facility)}
                          className="text-red-600 font-bold hover:text-red-700 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Furniture Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Furniture (Select Multiple)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  "Sofa",
                  "Bed",
                  "Dining Table",
                  "Coffee & Tea Table",
                  "Dressing",
                  "Chair",
                  "Bookshelf",
                  "Wardrobe",
                  "Desk",
                  "TV Stand",
                  "Nightstand",
                  "Study Table",
                ].map((furniture) => {
                  const isSelected = furnitures.includes(furniture);
                  const icon = getIcon(furniture, "furniture");
                  return (
                    <button
                      key={furniture}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          handleRemoveFurniture(furniture);
                        } else {
                          setFurniture([...furnitures, furniture]);
                        }
                      }}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-purple-600 bg-purple-50 shadow-md scale-105"
                          : "border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50/50"
                      }`}
                    >
                      <div className={`mb-2 ${isSelected ? "text-purple-600" : "text-gray-600"}`}>
                        {icon || <FaCouch className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs font-semibold text-center ${isSelected ? "text-purple-600" : "text-gray-700"}`}>
                        {furniture}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {furnitures.length > 0 && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-700 mb-2">
                    Selected ({furnitures.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {furnitures.map((furniture, index) => (
                      <div
                        key={index}
                        className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium"
                      >
                        {getIcon(furniture, "furniture")}
                        <span>{furniture}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFurniture(furniture)}
                          className="text-red-600 font-bold hover:text-red-700 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Apartment"}
              </button>
            </div>
          </>
        )}
      </div>

      <ToastContainer />
    </form>
  );
};

export default EditApartment;
