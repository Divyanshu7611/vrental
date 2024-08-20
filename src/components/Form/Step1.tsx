"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

type FormValues = {
  apartmentName: string;
  description: string;
  price: number;
  facility: string;
  location: string;
  images: FileList;
  category: string;
  availableFor: string;
  contactNo: number;
  furniture: string;
};

const Step1: React.FC = () => {
  const userContext = useContext(UserContext);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [handleLoading, setLoading] = useState<boolean>(false);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [furnitures, setFurniture] = useState<string[]>([]);

  const [facilityInput, setFacilityInput] = useState<string>("");
  const [furnitureInput, setFurnitureInput] = useState<string>("");
  const [localAddress, setLocalAddress] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5); // limit to 5 files
      setSelectedImages(filesArray);
    }
  };

  const handleAddFacility = () => {
    if (facilityInput && !facilities.includes(facilityInput)) {
      setFacilities([...facilities, facilityInput]);
      setFacilityInput("");
    }
  };
  const handleAddFurniture = () => {
    if (furnitureInput && !furnitures.includes(furnitureInput)) {
      setFurniture([...furnitures, furnitureInput]);
      setFurnitureInput("");
    }
  };

  const handleRemoveFacility = (facility: string) => {
    setFacilities(facilities.filter((f) => f !== facility));
  };
  const handleRemoveFurniture = (furniture: string) => {
    setFurniture(furnitures.filter((f) => f !== furniture));
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();
    formData.append("apartmentName", data.apartmentName);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("contactNo", data.contactNo.toString());
    formData.append("facility", facilities.join(", "));
    formData.append("furniture", furnitures.join(", "));

    const fullLocation = `${localAddress}, ${city}, ${state}, ${pincode}`;
    formData.append("location", fullLocation);
    formData.append("availableFor", data.availableFor.toString());
    formData.append("category", data.category);

    selectedImages.forEach((file) => formData.append("image", file));
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/aparment/createEvent?id=${userContext?.userAuthData?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        setLoading(false);
        toast.success("Apartment created successfully");
        reset(); // Reset the form
        // setSelectedImages([]); // Clear selected images
        // setFacilities([]); // Clear selected facilities
        // setLocalAddress(""); // Clear localAddress
        // setPincode(""); // Clear pincode
        // setCity(""); // Clear city
        // setState(""); // Clear state
        router.push("/profile");
      } else toast.error("Something Went Error");
    } catch (error: any) {
      setLoading(false);
      toast.error("Something Went Wrong");
      console.log(error);
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 px-6 py-8 sm:px-8 lg:px-12 bg-transparent"
    >
      {handleLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-5 max-w-[1200px] mx-auto">
          <div className="w-full bg-white rounded-xl p-6 sm:p-8 lg:p-10 shadow-xl">
            <h1 className="mb-4 text-2xl font-bold">General Information</h1>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full mt-4">
              <label
                className="w-full flex flex-col font-semibold"
                htmlFor="apartmentName"
              >
                Apartment Name
                <input
                  {...register("apartmentName", {
                    required: "Apartment name is required",
                  })}
                  className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Raman Villa"
                />
                {errors.apartmentName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.apartmentName.message}
                  </p>
                )}
              </label>
              <label
                className="w-full flex flex-col font-semibold"
                htmlFor="contactNo"
              >
                Contact No
                <input
                  type="number"
                  {...register("contactNo", {
                    required: "Contact number is required",
                  })}
                  className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="9854761278"
                />
                {errors.contactNo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactNo.message}
                  </p>
                )}
              </label>

              <label htmlFor="price" className="flex flex-col w-full">
                Price
                <input
                  type="number"
                  {...register("price", { required: "Price is required" })}
                  className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="5000"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </label>
            </div>
            <fieldset className="flex flex-col mt-6 font-semibold">
              <legend>Category</legend>
              <div>
                <div className="flex flex-col lg:flex-row gap-4 mt-2">
                  <label className="flex items-center gap-2 font-normal">
                    <input
                      type="radio"
                      value="ROOM"
                      className="bg-white"
                      {...register("category", {
                        required: "Category is required",
                      })}
                    />
                    ROOM
                  </label>
                  <label className="flex items-center gap-2 font-normal">
                    <input
                      type="radio"
                      value="PG"
                      className="bg-white"
                      {...register("category", {
                        required: "Category is required",
                      })}
                    />
                    PG
                  </label>
                  <label className="flex items-center gap-2 font-normal">
                    <input
                      type="radio"
                      value="HOSTEL"
                      className="bg-white"
                      {...register("category", {
                        required: "Category is required",
                      })}
                    />
                    HOSTEL
                  </label>
                  <label className="flex items-center gap-2 font-normal">
                    <input
                      type="radio"
                      value="CO-LIVING"
                      className="bg-white"
                      {...register("category", {
                        required: "Category is required",
                      })}
                    />
                    CO-LIVING
                  </label>
                  <label className="flex items-center gap-2 font-normal">
                    <input
                      type="radio"
                      value="FLAT"
                      className="bg-white"
                      {...register("category", {
                        required: "Category is required",
                      })}
                    />
                    FLAT
                  </label>
                </div>
              </div>

              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full mt-4">
                <label
                  className="w-full flex flex-col font-semibold"
                  htmlFor="LocalAddress"
                >
                  Street No./House No
                  <input
                    value={localAddress}
                    onChange={(e) => setLocalAddress(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="121 Chawani"
                    required
                  />
                </label>
                <label
                  className="w-full flex flex-col font-semibold"
                  htmlFor="pincode"
                >
                  PinCode
                  <input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="302001"
                    required
                  />
                </label>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full mt-4">
                <label
                  className="w-full flex flex-col font-semibold"
                  htmlFor="city"
                >
                  City
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Jaipur"
                    required
                  />
                </label>
                <label
                  className="w-full flex flex-col font-semibold"
                  htmlFor="state"
                >
                  State
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Rajasthan"
                    required
                  />
                </label>
              </div>
            </fieldset>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full mt-4 font-semibold">
              <label htmlFor="facility" className="flex flex-col w-full">
                Electronics
                <div className="flex items-center gap-2">
                  <select
                    value={facilityInput}
                    onChange={(e) => setFacilityInput(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select a facility</option>
                    <option value="Television">Television</option>
                    <option value="Refrigerator">Refrigerator</option>
                    <option value="Micorwave">Micorwave</option>
                    <option value="Toaster">Toaster</option>
                    <option value="Oven">Oven</option>
                    <option value="Washing Machine">Washing Machine</option>
                    <option value="Air Conditioner">Air Conditioner</option>
                    <option value="Cooler">Cooler</option>
                    <option value="Fan">Fan</option>
                    <option value="Vacuum Cleaner">Vacuum Cleaner</option>
                    <option value="Wifi">Wifi</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap max-w-[680px] mx-auto gap-1">
                  {facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-500 px-4 py-1 rounded-full flex items-center gap-2"
                    >
                      <span>{facility}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFacility(facility)}
                        className="text-red-500 font-semibold"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </label>
            </div>
            {/* furniture */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full mt-4 font-semibold">
              <label htmlFor="furniture" className="flex flex-col w-full">
                Furniture
                <div className="flex items-center gap-2">
                  <select
                    value={furnitureInput}
                    onChange={(e) => setFurnitureInput(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select a furniture</option>
                    <option value="Sofa">Sofa</option>
                    <option value="Bed">Bed</option>
                    <option value="Dining Table">Dinning Table</option>
                    <option value="Coffee & Tea Table">
                      Coffee & Tea Table
                    </option>
                    <option value="Dressing">Dressing</option>
                    <option value="Chair">Chair</option>
                    <option value="Bookshelf">Bookshelf</option>
                    <option value="Wardrobe">Wardrobe</option>
                    <option value="Desk">Desk</option>
                    <option value="TV Stand ">TV Stand </option>
                    <option value="Nightstand">Nightstand</option>
                    <option value="Study Table">Study Table</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddFurniture}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap max-w-[680px] mx-auto gap-1">
                  {furnitures.map((furniture, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-500 px-4 py-1 rounded-full flex items-center gap-2"
                    >
                      <span>{furniture}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFurniture(furniture)}
                        className="text-red-500 font-semibold"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </label>
            </div>
            <div className="flex flex-col mt-6 font-semibold">
              <label htmlFor="availableFor">Available For</label>
              <select
                {...register("availableFor", {
                  required: "Available for is required",
                })}
                className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select an option</option>
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Family">Family</option>
                <option value="Couple">Couple</option>
                <option value="Any">Any</option>
              </select>
              {errors.availableFor && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.availableFor.message}
                </p>
              )}
            </div>

            <div className="flex flex-col mt-6 font-semibold">
              <label htmlFor="description">Description</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="A beautiful place to live in..."
                rows={4}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full bg-white rounded-xl p-6 sm:p-8 lg:p-10 shadow">
            <h1 className="mb-4 text-2xl font-bold">Other Details</h1>

            <div className="flex flex-col mt-6 font-semibold">
              <label
                htmlFor="images"
                className="flex flex-col mt-4 font-semibold"
              >
                Upload Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  {...register("images", {
                    required: "Please upload images",
                    validate: {
                      lessThanFive: (files) =>
                        files.length <= 5 ||
                        "You can upload a maximum of 5 images",
                    },
                  })}
                  className="hidden"
                  id="image-upload"
                  onChange={handleImageChange}
                />
                <div className="image-upload-container border border-gray-400 rounded-lg flex items-center justify-center p-5 mt-2">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-center">
                      <span className="text-red-500 text-4xl">+</span>
                      <p>You can add up to 5 photos</p>
                    </div>
                  </label>
                </div>
                {selectedImages.length > 0 && (
                  <div className="selected-images mt-2 flex flex-wrap gap-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="inline-block p-1">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`selected ${index}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && (
                  <p className="text-red-500">{errors.images.message}</p>
                )}
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 mt-4 rounded-lg font-semibold hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      )}
      <ToastContainer />
    </form>
  );
};

export default Step1;
