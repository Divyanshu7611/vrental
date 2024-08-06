import React from "react";

interface ApartmentDetailsProps {
  data: {
    apartmentName: string;
    image_urls: string[];
    description: string;
    location: string;
    price: number;
    contactNo: number;
    // other apartment details
  };
}

const ApartmentDetails: React.FC<ApartmentDetailsProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-b from-[#00FFFF] to-[#009999] lg:w-3/4 p-5 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{data.apartmentName}</h1>
      <img
        src={data.image_urls[0]}
        alt={data.apartmentName}
        className="w-full h-60 object-cover rounded-lg mb-4"
      />
      <p>{data.description}</p>
      <p>Location: {data.location}</p>
      <p>Price: {data.price}</p>
      <p>Contact: {data.contactNo}</p>
      {/* ... other apartment details ... */}
    </div>
  );
};

export default ApartmentDetails;
