// "use client";
// import React, { useContext, useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import axios from "axios";
// import Navbar from "@/components/global/Navbar";
// import Footer from "@/components/global/Footer";
// import { UserContext } from "@/context/UserContext";
// import Image from "next/image";

// export default function Page() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);
//   const [ownerData, setOwnerData] = useState(null);
//   const searchParams = useSearchParams();
//   const id = searchParams.get("apartmentID");
//   const userContext = useContext(UserContext);

//   useEffect(() => {
//     if (!id) {
//       router.push("/");
//       return;
//     }

//     const fetchInfo = async () => {
//       try {
//         const response = await axios.get(
//           `/api/aparment/apartments?apartmentID=${id}`
//         );
//         if (response.data.data.length === 0) {
//           router.push("/");
//         } else {
//           setData(response.data.data);
//           const ownerID = response.data.data.ownerID;
//           const ownerResponse = await axios.get(
//             `/api/auth/getUser?id=${ownerID}`
//           );
//           setOwnerData(ownerResponse.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         // You can handle errors and possibly show an error message to the user here.
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInfo();
//   }, [id]);
//   console.log(data);
//   console.log(ownerData);
//   return (
//     <div className="bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF] min-w-screen min-h-screen">
//       {loading ? (
//         <div className="min-w-screen min-h-screen flex justify-center items-center">
//           <div className="loader"></div>
//         </div>
//       ) : (
//         <div className="min-w-screen min-h-screen">
//           <Navbar />
//           <div className="flex w-full justify-center p-3 mx-auto pt-20">
//             <div className="bg-gradient-to-b from-[#00FFFF] to-[#009999] w-3/4"></div>
//             <div className="w-1/4 flex flex-col">
//               <img
//                 src={userContext?.userAuthData?.image}
//                 alt="userImage"
//                 height={200}
//                 width={200}
//                 className="rounded-full border-[10px] border-gradient-to-b from-[#00F0FF] to-[#00666D]"
//               />
//               {/* <h1>{userContext?.userAuthData.}</h1> */}
//               <button>Call Now</button>
//               <button>Save</button>
//               <button>Interested</button>
//             </div>
//           </div>
//           <Footer />
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useSearchParams } from "next/navigation";
import useApartmentData from "@/hooks/userApartmentData";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import ApartmentDetails from "@/components/view/ApartmentDetails";
import OwnerDetails from "@/components/view/OwnerDetails";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("apartmentID");
  const { data, loading } = useApartmentData(id);
  // const dummyData = {
  //   apartmentName: "Luxury Apartment",
  //   image_urls: [
  //     "/images/apartment1.jpg",
  //     "/images/apartment2.jpg",
  //     "/images/apartment3.jpg",
  //     // Add more images if needed
  //   ],
  //   description: "A beautiful luxury apartment with all modern amenities.",
  //   location: "1234 Luxury Lane, Beverly Hills, CA",
  //   price: 5000,
  //   contactNo: 1234567890,
  //   category: "Luxury",
  //   facility:
  //     "Wifi, Swimming Pool, Gym, Parking, Elevator, Pet Friendly, 24/7 Security, Laundry Service, Garden, BBQ Area, Playground, Sauna, Spa, Business Center, Conference Room, Library, Concierge Service, Shuttle Service, Private Balcony, Air Conditioning, Heating, Dishwasher, Refrigerator, Washer/Dryer, Microwave, Oven, Gas Stove, Hardwood Floors, Carpet, Granite Countertops, Custom Cabinets, Walk-In Closet, Smart Home Technology, High-Speed Internet, Cable TV, Phone Service, Trash Removal, Cleaning Service, Pest Control, Snow Removal, Maintenance Service, Water, Electricity, Gas, Parking Garage, Bike Storage, Poolside Loungers, Tanning Beds, Hot Tub, Sauna, Steam Room, Yoga Studio, Fitness Classes, Personal Trainer, Massage Therapy, Nail Salon, Hair Salon, Grocery Delivery, Dry Cleaning, Shopping Discounts, Event Space",
  // };
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      {loading === false && data ? (
        <div className="min-w-screen min-h-screen">
          <Navbar />
          <div className="flex w-full lg:flex-row flex-col justify-center items-start p-3 mx-auto pt-20 space-x-4 gap-5">
            <ApartmentDetails data={data.apartment} />

            <OwnerDetails data={data.owner} apartment={data.apartment} />
          </div>
          <Footer />
        </div>
      ) : (
        <div className="min-w-screen min-h-screen flex items-center justify-center">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
