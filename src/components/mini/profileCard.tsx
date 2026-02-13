import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Edit2, Trash2, MapPin, Home } from "lucide-react";

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
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={`${category} image`}
          fill
          quality={100}
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-800 rounded-full shadow-sm">
            <Home className="w-3.5 h-3.5 text-blue-600" />
            {category}
          </span>
        </div>
        {/* Status Badge */}
        {status && (
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
              status === 'active' || status === 'verified' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {status}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-5 gap-4">
        {/* Price and Title */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{price}
            </span>
            <span className="text-sm text-gray-500">/{timePeriod}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {apartmentName}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">{location || address}</span>
          </div>
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={() => handleEdit(id)}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all duration-200 border border-red-200"
            onClick={() => handleDelete(id)}
            disabled={deleting}
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
