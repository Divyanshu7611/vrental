import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";

interface ICardDetails {
  price: number;
  timePeriod: string;
  category: string;
  address: string;
  image: string;
  id: string;
  status: string;
  apartmentName: string;
  description: string;
  facility: string;
  furniture: string;
  location: string;
  availableFor: string;
  paymentStatus: string;
}

const ProfileCard: React.FC<ICardDetails> = ({
  price,
  timePeriod,
  category,
  address,
  image,
  id,
  status,
  apartmentName,
  description,
  facility,
  furniture,
  location,
  availableFor,
  paymentStatus,
}) => {
  const [deleting, setDelete] = useState<boolean>(false);
  // handleEdit

  // handle Delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this apartment?")) {
      try {
        setDelete(true);
        const response = await axios.delete(
          `/api/aparment/deleteApartment?id=${id}`
        );

        if (response) {
          setDelete(false);
          alert("Apartment deleted successfully");
          window.location.reload();
        } else {
          setDelete(false);
          console.error("Failed to delete Apartment");
        }
      } catch (error: any) {
        setDelete(false);
        alert("Failed to delete Apartment");
        console.error("Error deleting Apartment:", error);
      }
    }
  };

  // handle edit fucntion
  const handleEdit = async (id: string) => {
    window.location.href = `/edit?id=${id}`;
  };
  return (
    <div className="p-2 border flex flex-col bg-white justify-between gap-5 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer mx-auto">
      <div>
        <Image
          src={image}
          alt={`${category} image`}
          width={265}
          height={165}
          quality={100}
          className="lg:w-[265px] lg:h-[185px] md:w-[285px] md:h-[165px] h-[225px] w-[325px]"
        />
      </div>
      <div className="flex flex-col justify-between gap-2">
        <h1 className="font-medium text-2xl">
          {price}₹/{timePeriod}
        </h1>
        <h1 className="text-xl font-medium">{apartmentName}</h1>
        <h3 className="text-sm font-semibold">{category} for Rent</h3>
        {/* <h3 className="text-sm">{status}</h3> */}
        {/* <h3 className="text-sm font-semibold">
          Verification Status: {paymentStatus}
        </h3> */}

        <h3 className="text-[10px] text-[#000000] opacity-50">{address}</h3>
        {/* <h3 className="text-[10px] text-[#000000] opacity-50">{date}</h3> */}
        {/* <h3 className="text-[10px]">{size}</h3> */}
      </div>
      <div className="flex gap-3">
        <button
          className="bg-gray-700 w-2/4 text-white text-sm px-4 py-2 rounded-lg hover:bg-black transition-all duration-200"
          onClick={() => handleEdit(id)}
        >
          Edit
        </button>
        <button
          className="bg-gray-700 w-2/4 text-white text-sm px-4 py-2 rounded-lg hover:bg-black transition-all duration-200"
          onClick={() => handleDelete(id)}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
