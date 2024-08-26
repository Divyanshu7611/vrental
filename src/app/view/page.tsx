"use client";
import { useRouter, useSearchParams } from "next/navigation";
import useApartmentData from "@/hooks/userApartmentData";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import ApartmentDetails from "@/components/view/ApartmentDetails";
import OwnerDetails from "@/components/view/OwnerDetails";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("apartmentID");
  const { data, loading } = useApartmentData(id);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // alert
      alert("Please Login Before Visiting To Apartment");
      router.push("/auth");
    }
  }, []);

  return (
    <div className="min-w-screen min-h-screen bg-white">
      {loading === false && data ? (
        <div className="min-w-screen min-h-screen">
          <Navbar />
          <div className="flex w-full lg:flex-row flex-col justify-center items-start p-3 mx-auto pt-20 space-x-4 gap-5">
            <ApartmentDetails data={data.apartment} />

            <OwnerDetails
              data={data.owner}
              contactNo={data.apartment.contactNo}
            />
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
