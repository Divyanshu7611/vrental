// "use client";
// import React, { useContext, useEffect, useState } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import Loading from "@/app/loading";
// import Spinner from "../global/Spinner";
// import "react-toastify/dist/ReactToastify.css";
// import { UserContext } from "@/context/UserContext";

// type FormValues = {
//   apartmentName: string;
//   description: string;
//   price: number;
//   facility: string;
//   furnitureDescription: string;
//   location: string;
//   furniture: boolean;
//   electricity: boolean;
//   parking: boolean;
//   images: FileList;
//   category: string;
//   availableFor: string;
//   contactNo: number;
// };

// const Step1: React.FC = () => {
//   const userContext = useContext(UserContext);
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       window.location.href = "/auth";
//     }
//   }, []);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FormValues>();
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [handleLoading, setLoading] = useState<boolean>(false);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const filesArray = Array.from(e.target.files).slice(0, 5); // limit to 5 files
//       setSelectedImages(filesArray);
//     }
//   };

//   const onSubmit: SubmitHandler<FormValues> = async (data) => {
//     const formData = new FormData();
//     formData.append("apartmentName", data.apartmentName);
//     formData.append("description", data.description);
//     formData.append("price", data.price.toString());
//     formData.append("contactNo", data.contactNo.toString());
//     formData.append("facility", data.facility);
//     formData.append("furnitureDescription", data.furnitureDescription);
//     formData.append("location", data.location);
//     formData.append("furniture", data.furniture.toString());
//     formData.append("availableFor", data.availableFor.toString());
//     formData.append("electricity", data.electricity.toString());
//     formData.append("parking", data.parking.toString());
//     formData.append("category", data.category);

//     selectedImages.forEach((file) => formData.append("image", file));
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `/api/aparment/createEvent?id=${userContext?.userAuthData?._id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       if (response) {
//         console.log(response);
//         setLoading(false);
//         toast.success("Apartment created successfully");
//         reset(); // Reset the form
//         setSelectedImages([]); // Clear selected images
//       } else toast.error("Something Went Error");
//     } catch (error) {
//       setLoading(false);
//       toast.error("Something Went Error");
//       console.error("Error:", error.response?.data || error.message);
//       // Handle error response
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="w-full flex flex-col gap-3 px-4 sm:px-6 lg:px-8"
//     >
//       {handleLoading ? (
//         <div className="flex flex-col items-center justify-center min-h-screen">
//           <div className="loader"></div>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center gap-2">
//           <div className="w-full bg-white rounded-xl p-6 sm:p-8 lg:p-10">
//             <h1 className="mb-2 text-xl font-bold">General Information</h1>
//             <div className="flex flex-col sm:flex-row sm:justify-between gap-5 w-full mt-3">
//               <label
//                 className="w-full flex flex-col font-semibold"
//                 htmlFor="apartmentName"
//               >
//                 Apartment Name
//                 <input
//                   {...register("apartmentName", {
//                     required: "Apartment name is required",
//                   })}
//                   className="border border-gray-400 rounded-lg px-3 py-2 font-normal bg-white"
//                   placeholder="Raman Villa"
//                 />
//                 {errors.apartmentName && (
//                   <p className="text-red-500">{errors.apartmentName.message}</p>
//                 )}
//               </label>
//               <label
//                 className="w-full flex flex-col font-semibold"
//                 htmlFor="contactNo"
//               >
//                 Contact No
//                 <input
//                   type="number"
//                   {...register("contactNo", {
//                     required: "Apartment name is required",
//                   })}
//                   className="border border-gray-400 rounded-lg px-3 py-2 font-normal bg-white"
//                   placeholder="9854761278"
//                 />
//                 {errors.apartmentName && (
//                   <p className="text-red-500">{errors.apartmentName.message}</p>
//                 )}
//               </label>
//               <label
//                 htmlFor="location"
//                 className="flex flex-col w-full font-semibold"
//               >
//                 Location
//                 <input
//                   {...register("location", {
//                     required: "Location is required",
//                   })}
//                   className="border border-gray-400 rounded-lg px-3 py-2 font-normal bg-white"
//                   placeholder="Mansarover jaipur"
//                 />
//                 {errors.location && (
//                   <p className="text-red-500">{errors.location.message}</p>
//                 )}
//               </label>
//             </div>
//             <fieldset className="flex flex-col mt-3 font-semibold">
//               <legend>Category</legend>
//               <div className="flex justify-start flex-col lg:flex-row gap-4">
//                 <label className="flex gap-1 font-normal">
//                   <input
//                     type="radio"
//                     value="ROOM"
//                     className="bg-white"
//                     {...register("category", {
//                       required: "Category is required",
//                     })}
//                   />
//                   ROOM
//                 </label>
//                 <label className="flex gap-1 font-normal">
//                   <input
//                     type="radio"
//                     value="PG"
//                     className="bg-white"
//                     {...register("category", {
//                       required: "Category is required",
//                     })}
//                   />
//                   PG
//                 </label>
//                 <label className="flex gap-1 font-normal">
//                   <input
//                     type="radio"
//                     value="HOSTEL"
//                     className="bg-white"
//                     {...register("category", {
//                       required: "Category is required",
//                     })}
//                   />
//                   HOSTEL
//                 </label>
//                 <label className="flex gap-1 font-normal">
//                   <input
//                     type="radio"
//                     value="CO-LIVING"
//                     className="bg-white"
//                     {...register("category", {
//                       required: "Category is required",
//                     })}
//                   />
//                   CO-LIVING
//                 </label>
//                 <label className="flex gap-1 font-normal">
//                   <input
//                     type="radio"
//                     value="FLAT"
//                     className="bg-white"
//                     {...register("category", {
//                       required: "Category is required",
//                     })}
//                   />
//                   FLAT
//                 </label>
//               </div>
//               {errors.category && (
//                 <p className="text-red-500">{errors.category.message}</p>
//               )}
//             </fieldset>
//             <div className="flex flex-col sm:flex-row sm:justify-between gap-5 w-full mt-3 font-semibold">
//               <label htmlFor="price" className="flex flex-col w-full">
//                 Price
//                 <input
//                   type="number"
//                   {...register("price", { required: "Price is required" })}
//                   className="border border-gray-400 rounded-lg px-3 py-2 font-normal bg-white"
//                   placeholder="5000"
//                 />
//                 {errors.price && (
//                   <p className="text-red-500">{errors.price.message}</p>
//                 )}
//               </label>
//               <label htmlFor="facility" className="flex flex-col w-full">
//                 Facility
//                 <input
//                   {...register("facility", {
//                     required: "Facility is required",
//                   })}
//                   className="border border-gray-400 rounded-lg px-3 py-2 font-normal bg-white"
//                   placeholder="Swimming Pool, Gym"
//                 />
//                 {errors.facility && (
//                   <p className="text-red-500">{errors.facility.message}</p>
//                 )}
//               </label>
//               <label
//                 htmlFor="furnitureDescription"
//                 className="flex flex-col w-full"
//               >
//                 Furniture Description
//                 <input
//                   {...register("furnitureDescription", {
//                     required: "Furniture description is required",
//                   })}
//                   placeholder="Fully furnished with a bed, sofa, and dining table"
//                   className="border border-gray-400 rounded-lg px-3 py-2 font-normal bg-white"
//                 />
//                 {errors.furnitureDescription && (
//                   <p className="text-red-500">
//                     {errors.furnitureDescription.message}
//                   </p>
//                 )}
//               </label>
//             </div>
//             {/* <div className="flex flex-col sm:flex-row sm:justify-between gap-5 w-full mt-3">

//         </div> */}
//             <div className="flex flex-col lg:flex-row lg:justify-between gap-5 items-start mt-3 font-semibold">
//               <label htmlFor="furniture" className="flex gap-3 items-center">
//                 Furniture
//                 <input
//                   type="checkbox"
//                   {...register("furniture")}
//                   className="border border-gray-400 rounded-lg p-2 font-medium bg-white"
//                 />
//               </label>
//               <label htmlFor="electricity" className="flex gap-3 items-center">
//                 Electricity
//                 <input
//                   type="checkbox"
//                   {...register("electricity")}
//                   className="border border-gray-400 rounded-lg p-2 font-medium bg-white"
//                 />
//               </label>
//               <label htmlFor="parking" className="flex gap-3 items-center">
//                 Parking
//                 <input
//                   type="checkbox"
//                   {...register("parking")}
//                   className="border border-gray-400 rounded-lg p-2 font-medium bg-white"
//                 />
//               </label>
//             </div>
// <label
//   htmlFor="availableFor"
//   className="flex flex-col mt-3 font-semibold"
// >
//   Available for
//   <select
//     {...register("availableFor", {
//       required: "Please select an option",
//     })}
//     className="border border-gray-400 rounded-lg px-3 py-2 font-normal bg-white"
//   >
//     <option value="">Select an option</option>
//     <option value="Boys">Boys</option>
//     <option value="Girls">Girls</option>
//     <option value="Family">Family</option>
//     <option value="All">Above All</option>
//   </select>
//   {errors.availableFor && (
//     <p className="text-red-500">{errors.availableFor.message}</p>
//   )}
// </label>
//             <label
//               htmlFor="description"
//               className="flex flex-col mt-3 font-semibold"
//             >
//               Description
//               <textarea
//                 {...register("description", {
//                   required: "Description is required",
//                 })}
//                 placeholder="Describe the apartment in detai"
//                 className="border border-gray-400 rounded-lg px-3 py-2 font-normal bg-white"
//                 rows={3}
//                 cols={30}
//               />
//               {errors.description && (
//                 <p className="text-red-500">{errors.description.message}</p>
//               )}
//             </label>

//             <label
//               htmlFor="images"
//               className="flex flex-col mt-4 font-semibold"
//             >
//               Upload Images
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 {...register("images", {
//                   required: "Please upload images",
//                   validate: {
//                     lessThanFive: (files) =>
//                       files.length <= 5 ||
//                       "You can upload a maximum of 5 images",
//                   },
//                 })}
//                 className="hidden"
//                 id="image-upload"
//                 onChange={handleImageChange}
//               />
//               <div className="image-upload-container border border-gray-400 rounded-lg flex items-center justify-center p-5 mt-2">
//                 <label htmlFor="image-upload" className="cursor-pointer">
//                   <div className="text-center">
//                     <span className="text-red-500 text-4xl">+</span>
//                     <p>You can add up to 5 photos</p>
//                   </div>
//                 </label>
//               </div>
//               {selectedImages.length > 0 && (
//                 <div className="selected-images mt-2 flex flex-wrap gap-2">
//                   {selectedImages.map((image, index) => (
//                     <div key={index} className="inline-block p-1">
//                       <img
//                         src={URL.createObjectURL(image)}
//                         alt={`selected ${index}`}
//                         className="h-20 w-20 object-cover rounded-md"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}
//               {errors.images && (
//                 <p className="text-red-500">{errors.images.message}</p>
//               )}
//             </label>
//           </div>
//           <button
//             type="submit"
//             className="mx-auto py-2 px-6 bg-blue-600 rounded-md text-white text-lg font-medium"
//           >
//             Register
//           </button>
//         </div>
//       )}
//       <ToastContainer />
//     </form>
//   );
// };

// export default Step1;

"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "@/context/UserContext";

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
  const [facilityInput, setFacilityInput] = useState<string>("");

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

  const handleRemoveFacility = (facility: string) => {
    setFacilities(facilities.filter((f) => f !== facility));
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();
    formData.append("apartmentName", data.apartmentName);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("contactNo", data.contactNo.toString());
    formData.append("facility", facilities.join(", "));
    formData.append("location", data.location);
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
        setSelectedImages([]); // Clear selected images
        setFacilities([]); // Clear selected facilities
      } else toast.error("Something Went Error");
      console.log(formData);
    } catch (error) {
      setLoading(false);
      toast.error("Something Went Error");
      console.error("Error:", error.response?.data || error.message);
      // Handle error response
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-5 px-6 py-8 sm:px-8 lg:px-12 bg-gray-50 rounded-lg shadow-md"
    >
      {handleLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen min-w-screen">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="w-full bg-white rounded-xl p-6 sm:p-8 lg:p-10 shadow">
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
              <label
                className="w-full flex flex-col font-semibold"
                htmlFor="location"
              >
                Location
                <input
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Mansarover, Jaipur"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location.message}
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
              <div>
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
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </fieldset>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full mt-4 font-semibold">
              <label htmlFor="facility" className="flex flex-col w-full">
                Facility
                <div className="flex items-center gap-2">
                  <select
                    value={facilityInput}
                    onChange={(e) => setFacilityInput(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select a facility</option>
                    <option value="Swimming Pool">Swimming Pool</option>
                    <option value="Gym">Gym</option>
                    <option value="Wifi">Wifi</option>
                    <option value="Parking">Parking</option>
                    <option value="Security">Security</option>
                    <option value="Garden">Garden</option>
                    <option value="Power Backup">Power Backup</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap">
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
