// "use client";
// import React, { useContext, useEffect, useState } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import "react-toastify/dist/ReactToastify.css";
// import { UserContext } from "@/context/UserContext";
// import { useRouter } from "next/navigation";
// import FixedQrCode from "../payment/FixedQrCode";

// type FormValues = {
//   apartmentName: string;
//   description: string;
//   price: number;
//   facility: string;
//   location: string;
//   images: FileList;
//   category: string;
//   availableFor: string;
//   contactNo: number;
//   furniture: string;
//   txnID: string;
//   membershipPlan?: string;
//   planAmount?: number;
// };

// const Step1: React.FC = () => {
//   const userContext = useContext(UserContext);
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     console.log("Token:", token);
//     if (!token) {
//       window.location.href = "/auth";
//     }
//   }, []);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//   } = useForm<FormValues>({ mode: "onChange" });
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [handleLoading, setLoading] = useState<boolean>(false);
//   const [facilities, setFacilities] = useState<string[]>([]);
//   const [furnitures, setFurniture] = useState<string[]>([]);

//   const [facilityInput, setFacilityInput] = useState<string>("");
//   const [furnitureInput, setFurnitureInput] = useState<string>("");
//   const [localAddress, setLocalAddress] = useState<string>("");
//   const [pincode, setPincode] = useState<string>("");
//   const [city, setCity] = useState<string>("");
//   const [state, setState] = useState<string>("");
//   const [txnID, settxnID] = useState<string>("");

//   const [payment, setPayment] = useState<boolean>(false);
//   const [selectedPlan, setSelectedPlan] = useState<string>("");
//   const [planAmount, setPlanAmount] = useState<number>(0);
//   const watchAllFields = watch();
//   const [isFormComplete, setIsFormComplete] = useState<boolean>(false);

//   const router = useRouter();

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const filesArray = Array.from(e.target.files).slice(0, 5); // limit to 5 files
//       setSelectedImages(filesArray);
//     }
//   };

//   const handleAddFacility = () => {
//     if (facilityInput && !facilities.includes(facilityInput)) {
//       setFacilities([...facilities, facilityInput]);
//       setFacilityInput("");
//     }
//   };
//   const handleAddFurniture = () => {
//     if (furnitureInput && !furnitures.includes(furnitureInput)) {
//       setFurniture([...furnitures, furnitureInput]);
//       setFurnitureInput("");
//     }
//   };

//   const handleRemoveFacility = (facility: string) => {
//     setFacilities(facilities.filter((f) => f !== facility));
//   };
//   const handleRemoveFurniture = (furniture: string) => {
//     setFurniture(furnitures.filter((f) => f !== furniture));
//   };

//   useEffect(() => {
//     const checkFormCompleteness = () => {
//       const isComplete =
//         !!watchAllFields.apartmentName &&
//         !!watchAllFields.description &&
//         !!watchAllFields.price &&
//         !!watchAllFields.contactNo &&
//         !!watchAllFields.category &&
//         !!watchAllFields.availableFor &&
//         selectedImages.length > 0 &&
//         facilities.length > 0 &&
//         furnitures.length > 0 &&
//         !!localAddress &&
//         !!pincode &&
//         !!city &&
//         !!state;

//       setIsFormComplete(isComplete);
//     };

//     checkFormCompleteness();
//   }, [
//     watchAllFields,
//     selectedImages,
//     facilities,
//     furnitures,
//     localAddress,
//     pincode,
//     city,
//     state,
//   ]);

//   const onSubmit: SubmitHandler<FormValues> = async (data) => {
//     const formData = new FormData();
//     formData.append("apartmentName", data.apartmentName);
//     formData.append("description", data.description);
//     formData.append("price", data.price.toString());
//     formData.append("contactNo", data.contactNo.toString());
//     formData.append("facility", facilities.join(", "));
//     formData.append("furniture", furnitures.join(", "));

//     const fullLocation = `${localAddress}, ${city}, ${state}, ${pincode}`;
//     formData.append("location", fullLocation);
//     formData.append("availableFor", data.availableFor.toString());
//     formData.append("category", data.category);
//     formData.append("txnID", data.txnID);
//     formData.append("membershipPlan", selectedPlan);
//     formData.append("planAmount", planAmount.toString());

//     selectedImages.forEach((file) => formData.append("image", file));
//     formData.forEach((value, key) => {
//       console.log(`${key}: ${value}`);
//     });
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
//         setLoading(false);
//         toast.success("Apartment created successfully");
//         reset(); // Reset the form

//         // router.push("/test/success");
//         router.push("/profile");
//       } else toast.error("Something Went Error");
//     } catch (error: any) {
//       setLoading(false);
//       toast.error("Something Went Wrong");
//       console.log(error);
//       console.error("Error:", error.response?.data || error.message);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="flex flex-col gap-5 px-6 py-8 sm:px-8 lg:px-12 bg-transparent"
//     >
//       {handleLoading ? (
//         <div className="flex flex-col items-center justify-center min-h-screen">
//           <div className="loader"></div>
//         </div>
//       ) : (
//         <div className="flex items-center justify-center gap-5 max-w-[1200px] lg:mx-auto mx-5">
//           {!payment && (
//             <div className="flex flex-col items-center justify-center gap-5 max-w-[1200px] mx-auto">
//               <div className="w-full bg-white rounded-xl p-6 sm:p-8 lg:p-10 shadow-xl">
//                 <h1 className="mb-4 text-2xl font-bold">General Information</h1>
//                 <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full mt-4">
//                   <label
//                     className="w-full flex flex-col font-semibold"
//                     htmlFor="apartmentName"
//                   >
//                     Apartment Name
//                     <input
//                       {...register("apartmentName", {
//                         required: "Apartment name is required",
//                       })}
//                       className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                       placeholder="Raman Villa"
//                     />
//                     {errors.apartmentName && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.apartmentName.message}
//                       </p>
//                     )}
//                   </label>
//                   <label
//                     className="w-full flex flex-col font-semibold"
//                     htmlFor="contactNo"
//                   >
//                     Contact No
//                     <input
//                       type="number"
//                       {...register("contactNo", {
//                         required: "Contact number is required",
//                       })}
//                       className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                       placeholder="9854761278"
//                     />
//                     {errors.contactNo && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.contactNo.message}
//                       </p>
//                     )}
//                   </label>

//                   <label
//                     htmlFor="price"
//                     className="flex flex-col w-full font-semibold"
//                   >
//                     Rent/Month
//                     <input
//                       type="number"
//                       {...register("price", { required: "Price is required" })}
//                       className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                       placeholder="5000"
//                     />
//                     {errors.price && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.price.message}
//                       </p>
//                     )}
//                   </label>
//                 </div>
//                 <fieldset className="flex flex-col mt-6 font-semibold">
//                   <legend>Category</legend>
//                   <div>
//                     <div className="flex flex-col lg:flex-row gap-4 mt-2">
//                       <label className="flex items-center gap-2 font-normal">
//                         <input
//                           type="radio"
//                           value="ROOM"
//                           className="bg-white"
//                           {...register("category", {
//                             required: "Category is required",
//                           })}
//                         />
//                         ROOM
//                       </label>
//                       <label className="flex items-center gap-2 font-normal">
//                         <input
//                           type="radio"
//                           value="PG"
//                           className="bg-white"
//                           {...register("category", {
//                             required: "Category is required",
//                           })}
//                         />
//                         PG
//                       </label>
//                       <label className="flex items-center gap-2 font-normal">
//                         <input
//                           type="radio"
//                           value="HOSTEL"
//                           className="bg-white"
//                           {...register("category", {
//                             required: "Category is required",
//                           })}
//                         />
//                         HOSTEL
//                       </label>
//                       <label className="flex items-center gap-2 font-normal">
//                         <input
//                           type="radio"
//                           value="CO-LIVING"
//                           className="bg-white"
//                           {...register("category", {
//                             required: "Category is required",
//                           })}
//                         />
//                         CO-LIVING
//                       </label>
//                       <label className="flex items-center gap-2 font-normal">
//                         <input
//                           type="radio"
//                           value="FLAT"
//                           className="bg-white"
//                           {...register("category", {
//                             required: "Category is required",
//                           })}
//                         />
//                         FLAT
//                       </label>
//                       <label className="flex items-center gap-2 font-normal">
//                         <input
//                           type="radio"
//                           value="SHOP"
//                           className="bg-white"
//                           {...register("category", {
//                             required: "Category is required",
//                           })}
//                         />
//                         SHOP
//                       </label>
//                     </div>
//                   </div>

//                   {errors.category && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.category.message}
//                     </p>
//                   )}
//                   <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full mt-4">
//                     <label
//                       className="w-full flex flex-col font-semibold"
//                       htmlFor="LocalAddress"
//                     >
//                       Address
//                       <input
//                         value={localAddress}
//                         onChange={(e) => setLocalAddress(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                         placeholder="121 Chawani"
//                         required
//                       />
//                     </label>
//                     <label
//                       className="w-full flex flex-col font-semibold"
//                       htmlFor="pincode"
//                     >
//                       PinCode
//                       <input
//                         value={pincode}
//                         onChange={(e) => setPincode(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                         placeholder="302001"
//                         required
//                       />
//                     </label>
//                   </div>
//                   <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full mt-4">
//                     <label
//                       className="w-full flex flex-col font-semibold"
//                       htmlFor="city"
//                     >
//                       City
//                       <input
//                         value={city}
//                         onChange={(e) => setCity(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                         placeholder="Jaipur"
//                         required
//                       />
//                     </label>
//                     <label
//                       className="w-full flex flex-col font-semibold"
//                       htmlFor="state"
//                     >
//                       State
//                       <input
//                         value={state}
//                         onChange={(e) => setState(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                         placeholder="Rajasthan"
//                         required
//                       />
//                     </label>
//                   </div>
//                 </fieldset>
//                 <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full mt-4 font-semibold">
//                   <label htmlFor="facility" className="flex flex-col w-full">
//                     Electronics
//                     <div className="flex items-center gap-2">
//                       <select
//                         value={facilityInput}
//                         onChange={(e) => setFacilityInput(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                       >
//                         <option value="">Select a facility</option>
//                         <option value="Television">Television</option>
//                         <option value="Refrigerator">Refrigerator</option>
//                         <option value="Micorwave">Micorwave</option>
//                         <option value="Toaster">Toaster</option>
//                         <option value="Oven">Oven</option>
//                         <option value="Washing Machine">Washing Machine</option>
//                         <option value="Air Conditioner">Air Conditioner</option>
//                         <option value="Cooler">Cooler</option>
//                         <option value="Fan">Fan</option>
//                         <option value="Vacuum Cleaner">Vacuum Cleaner</option>
//                         <option value="Wifi">Wifi</option>
//                       </select>
//                       <button
//                         type="button"
//                         onClick={handleAddFacility}
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                       >
//                         Add
//                       </button>
//                     </div>
//                     <div className="mt-2 flex flex-wrap max-w-[680px] mx-auto gap-1">
//                       {facilities.map((facility, index) => (
//                         <div
//                           key={index}
//                           className="bg-blue-200 text-blue-500 px-4 py-1 rounded-full flex items-center gap-2"
//                         >
//                           <span>{facility}</span>
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveFacility(facility)}
//                             className="text-red-500 font-semibold"
//                           >
//                             &times;
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </label>
//                 </div>
//                 {/* furniture */}
//                 <div className="flex flex-col sm:flex-row sm:justify-between gap-6 w-full mt-4 font-semibold">
//                   <label htmlFor="furniture" className="flex flex-col w-full">
//                     Furniture
//                     <div className="flex items-center gap-2">
//                       <select
//                         value={furnitureInput}
//                         onChange={(e) => setFurnitureInput(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                       >
//                         <option value="">Select a furniture</option>
//                         <option value="Sofa">Sofa</option>
//                         <option value="Bed">Bed</option>
//                         <option value="Dining Table">Dinning Table</option>
//                         <option value="Coffee & Tea Table">
//                           Coffee & Tea Table
//                         </option>
//                         <option value="Dressing">Dressing</option>
//                         <option value="Chair">Chair</option>
//                         <option value="Bookshelf">Bookshelf</option>
//                         <option value="Wardrobe">Wardrobe</option>
//                         <option value="Desk">Desk</option>
//                         <option value="TV Stand ">TV Stand </option>
//                         <option value="Nightstand">Nightstand</option>
//                         <option value="Study Table">Study Table</option>
//                       </select>
//                       <button
//                         type="button"
//                         onClick={handleAddFurniture}
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                       >
//                         Add
//                       </button>
//                     </div>
//                     <div className="mt-2 flex flex-wrap max-w-[680px] mx-auto gap-1">
//                       {furnitures.map((furniture, index) => (
//                         <div
//                           key={index}
//                           className="bg-blue-200 text-blue-500 px-4 py-1 rounded-full flex items-center gap-2"
//                         >
//                           <span>{furniture}</span>
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveFurniture(furniture)}
//                             className="text-red-500 font-semibold"
//                           >
//                             &times;
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </label>
//                 </div>
//                 <div className="flex flex-col mt-6 font-semibold">
//                   <label htmlFor="availableFor">Available For</label>
//                   <select
//                     {...register("availableFor", {
//                       required: "Available for is required",
//                     })}
//                     className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                   >
//                     <option value="">Select an option</option>
//                     <option value="Boys">Boys</option>
//                     <option value="Girls">Girls</option>
//                     <option value="Family">Family</option>
//                     <option value="Couple">Couple</option>
//                     <option value="Any">Any</option>
//                   </select>
//                   {errors.availableFor && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.availableFor.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex flex-col mt-6 font-semibold">
//                   <label htmlFor="description">Description</label>
//                   <textarea
//                     {...register("description", {
//                       required: "Description is required",
//                       validate: (value) => {
//                         const wordCount = value.trim().split(/\s+/).length;
//                         return (
//                           wordCount <= 500 ||
//                           "Description cannot exceed 500 words"
//                         );
//                       },
//                     })}
//                     className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                     placeholder="A beautiful place to live in...(Maximum 500 words)"
//                     rows={4}
//                   ></textarea>
//                   {errors.description && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.description.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div className="w-full bg-white rounded-xl p-6 sm:p-8 lg:p-10 shadow">
//                 <h1 className="mb-4 text-2xl font-bold">Other Details</h1>

//                 <div className="flex flex-col mt-6 font-semibold">
//                   <label
//                     htmlFor="images"
//                     className="flex flex-col mt-4 font-semibold"
//                   >
//                     Upload Images
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       {...register("images", {
//                         required: "Please upload images",
//                         validate: {
//                           lessThanFive: (files) =>
//                             files.length <= 5 ||
//                             "You can upload a maximum of 5 images",
//                         },
//                       })}
//                       className="hidden"
//                       id="image-upload"
//                       onChange={handleImageChange}
//                     />
//                     <div className="image-upload-container border border-gray-400 rounded-lg flex items-center justify-center p-5 mt-2">
//                       <label htmlFor="image-upload" className="cursor-pointer">
//                         <div className="text-center">
//                           <span className="text-red-500 text-4xl">+</span>
//                           <p>You can add up to 5 photos</p>
//                         </div>
//                       </label>
//                     </div>
//                     {selectedImages.length > 0 && (
//                       <div className="selected-images mt-2 flex flex-wrap gap-2">
//                         {selectedImages.map((image, index) => (
//                           <div key={index} className="inline-block p-1">
//                             <img
//                               src={URL.createObjectURL(image)}
//                               alt={`selected ${index}`}
//                               className="h-20 w-20 object-cover rounded-md"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                     {errors.images && (
//                       <p className="text-red-500">{errors.images.message}</p>
//                     )}
//                   </label>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 onClick={() => {
//                   if (isFormComplete) {
//                     setPayment(true);
//                   } else {
//                     toast.error("Please fill all required fields");
//                   }
//                 }}
//                 className={`px-6 py-3 mt-4 rounded-lg font-semibold ${
//                   isFormComplete
//                     ? "bg-blue-500 text-white hover:bg-blue-600"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//                 disabled={!isFormComplete}
//               >
//                 Submit
//               </button>
//             </div>
//           )}
//           {payment && (
//             <div className="flex flex-col items-center justify-center gap-5 border bg-white lg:p-10 md:p-10 p-5 rounded-xl text-black mx-auto">
//               <h1 className="text-center font-semibold">
//                 Choose Your Membership Plan
//               </h1>

//               {/* Membership Plans */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
//                 <div
//                   className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                     selectedPlan === "1month"
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-300 hover:border-blue-300"
//                   }`}
//                   onClick={() => {
//                     setSelectedPlan("1month");
//                     setPlanAmount(99);
//                   }}
//                 >
//                   <div className="text-center">
//                     <h3 className="text-lg font-bold text-blue-600">1 Month</h3>
//                     <div className="text-3xl font-bold text-gray-800 mt-2">
//                       ₹99
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1">Basic Plan</p>
//                     <ul className="text-xs text-gray-600 mt-3 space-y-1">
//                       <li>• Apartment listing for 1 month</li>
//                       <li>• Basic support</li>
//                       <li>• Standard features</li>
//                     </ul>
//                   </div>
//                 </div>

//                 <div
//                   className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                     selectedPlan === "6month"
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-300 hover:border-blue-300"
//                   }`}
//                   onClick={() => {
//                     setSelectedPlan("6month");
//                     setPlanAmount(499);
//                   }}
//                 >
//                   <div className="text-center">
//                     <h3 className="text-lg font-bold text-blue-600">
//                       6 Months
//                     </h3>
//                     <div className="text-3xl font-bold text-gray-800 mt-2">
//                       ₹499
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1">Popular Plan</p>
//                     <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
//                       Save ₹95
//                     </div>
//                     <ul className="text-xs text-gray-600 mt-3 space-y-1">
//                       <li>• Apartment listing for 6 months</li>
//                       <li>• Priority support</li>
//                       <li>• Enhanced features</li>
//                     </ul>
//                   </div>
//                 </div>

//                 <div
//                   className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                     selectedPlan === "12month"
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-300 hover:border-blue-300"
//                   }`}
//                   onClick={() => {
//                     setSelectedPlan("12month");
//                     setPlanAmount(999);
//                   }}
//                 >
//                   <div className="text-center">
//                     <h3 className="text-lg font-bold text-blue-600">
//                       12 Months
//                     </h3>
//                     <div className="text-3xl font-bold text-gray-800 mt-2">
//                       ₹999
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1">Best Value</p>
//                     <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
//                       Save ₹189
//                     </div>
//                     <ul className="text-xs text-gray-600 mt-3 space-y-1">
//                       <li>• Apartment listing for 12 months</li>
//                       <li>• Premium support</li>
//                       <li>• All features included</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               {selectedPlan && (
//                 <div className="text-center">
//                   <h2 className="text-xl font-semibold mb-4">
//                     Pay ₹{planAmount} to Register Your Apartment
//                   </h2>
//                   <FixedQrCode amount={planAmount} />
//                 </div>
//               )}

//               {!selectedPlan && (
//                 <div className="text-center text-red-500 text-sm">
//                   Please select a membership plan to continue
//                 </div>
//               )}
//               <label
//                 className="w-full flex flex-col font-semibold"
//                 htmlFor="txnId"
//               >
//                 Transaction Id
//                 <input
//                   {...register("txnID", {
//                     required: "txnID is required",
//                   })}
//                   className="border border-gray-300 rounded-lg px-4 py-2 font-normal bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                   placeholder="Transaction Id"
//                 />
//                 {errors.txnID && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.txnID.message}
//                   </p>
//                 )}
//               </label>
//               <button
//                 type="submit"
//                 disabled={!selectedPlan}
//                 className={`px-6 py-3 mt-4 rounded-lg font-semibold w-full ${
//                   selectedPlan
//                     ? "bg-blue-500 text-white hover:bg-blue-600"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 Submit
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setPayment(false);
//                 }}
//                 className="bg-red-500 text-white px-6 py-3 mt-1 rounded-lg font-semibold hover:bg-blue-600 w-full"
//               >
//                 Back
//               </button>
//             </div>
//           )}
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
import { useRouter } from "next/navigation";
import FixedQrCode from "../payment/FixedQrCode";

type FormValues = {
  apartmentName: string;
  description: string;
  price: number;
  contactNo: number;
  category: string;
  availableFor: string;
  txnID: string;
};

const Step1: React.FC = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({ mode: "onChange" });

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [furnitures, setFurniture] = useState<string[]>([]);
  const [facilityInput, setFacilityInput] = useState("");
  const [furnitureInput, setFurnitureInput] = useState("");

  const [localAddress, setLocalAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [selectedPlan, setSelectedPlan] = useState("");
  const [planAmount, setPlanAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const nextStep = () => step < totalSteps && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/auth";
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files).slice(0, 5));
    }
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
      formData.append("availableFor", data.availableFor);
      formData.append("category", data.category);
      formData.append("txnID", data.txnID);
      formData.append("membershipPlan", selectedPlan);
      formData.append("planAmount", planAmount.toString());

      selectedImages.forEach((file) => formData.append("image", file));

      await axios.post(
        `/api/aparment/createEvent?id=${userContext?.userAuthData?._id}`,
        formData
      );

      toast.success("Apartment created successfully!");
      router.push("/profile");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full"
    >
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
            { num: 3, label: "Media" },
            { num: 4, label: "Payment" },
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
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>

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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="">Select Category</option>
                  <option value="ROOM">Room</option>
                  <option value="PG">PG</option>
                  <option value="HOSTEL">Hostel</option>
                  <option value="CO-LIVING">Co-Living</option>
                  <option value="FLAT">Flat</option>
                  <option value="SHOP">Shop</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Available For *
                </label>
                <select
                  {...register("availableFor", { required: "Available for is required" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
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

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Location Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  value={localAddress}
                  onChange={(e) => setLocalAddress(e.target.value)}
                  placeholder="e.g., 121 Chawani"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
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

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Media & Description</h2>

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

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Images (Up to 5 images)
              </label>
              
              {/* Image Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-colors duration-200"
                >
                  {selectedImages.length === 0 ? (
                    <>
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB (max 5 images)
                      </p>
                    </>
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-blue-500 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">
                        Click to add more images
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedImages.length}/5 images selected
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Image Preview Grid */}
              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {selectedImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImages(
                              selectedImages.filter((_, i) => i !== index)
                            );
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          aria-label="Remove image"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 text-center">
                          Image {index + 1}
                        </div>
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
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={selectedImages.length === 0}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Membership Plan</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { name: "1 Month", value: "1month", price: 99, savings: null },
                { name: "6 Months", value: "6month", price: 499, savings: 95 },
                { name: "12 Months", value: "12month", price: 999, savings: 189 },
              ].map((plan) => (
                <div
                  key={plan.value}
                  onClick={() => {
                    setSelectedPlan(plan.value);
                    setPlanAmount(plan.price);
                  }}
                  className={`border-2 p-6 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedPlan === plan.value
                      ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
                      : "border-gray-300 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ₹{plan.price}
                    </div>
                    {plan.savings && (
                      <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        Save ₹{plan.savings}
                      </div>
                    )}
                    <ul className="text-sm text-gray-600 space-y-1 mt-3 text-left">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Listing for {plan.name.toLowerCase()}
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Priority support
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {selectedPlan && (
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-center text-lg font-semibold text-gray-800 mb-4">
                    Pay ₹{planAmount} to Register Your Apartment
                  </p>
                  <FixedQrCode amount={planAmount} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transaction ID *
                  </label>
                  <input
                    {...register("txnID", { required: "Transaction ID is required" })}
                    placeholder="Enter your transaction ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {errors.txnID && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.txnID.message as string}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!selectedPlan && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm text-center">
                  Please select a membership plan to continue
                </p>
              </div>
            )}

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
                disabled={!selectedPlan || loading}
                className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-md ${
                  selectedPlan && !loading
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </form>
  );
};

export default Step1;