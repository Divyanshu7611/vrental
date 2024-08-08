// import React from "react";
// import Swipper from "./Swiper";

// interface ApartmentDetailsProps {
//   data: {
//     apartmentName: string;
//     image_urls: string[];
//     description: string;
//     location: string;
//     price: number;
//     contactNo: number;
//     category: string;
//     facility: string;
//     // other apartment details
//   };
// }

// const ApartmentDetails: React.FC<ApartmentDetailsProps> = ({ data }) => {
//   return (
//     <div className="bg-gradient-to-b from-[#00FFFF] to-[#009999] lg:w-3/4 p-5 rounded-lg shadow-lg w-full">
//       {/* <img
//         src={data.image_urls[0]}
//         alt={data.apartmentName}
//         className="w-full h-60 object-cover rounded-lg mb-4"
//       /> */}

//       <Swipper images={data.image_urls} />
//       <div className="flex w-full justify-between">
//         <div className="flex flex-col">
//           <h1 className="lg:text-2xl text-lg font-bold">
//             {data.apartmentName}
//           </h1>
//           <p className="lg:text-sm text-xs">{data.category}</p>
//         </div>
//         <p className="text-[#FF0000] font-semibold lg:text-2xl text-lg">
//           Price: {data.price}
//         </p>
//       </div>
//       <p className="text-lg font-medium">Location: {data.location}</p>

//       <div className="bg-gradient-to-b from-[#00FFFF] to-[#009999] w-full rounded-xl">
//         <p className="text-lg font-medium">Location: {data.facility}</p>
//       </div>
//     </div>
//   );
// };

// export default ApartmentDetails;

import React from "react";
import Swipper from "./Swiper";

interface ApartmentDetailsProps {
  data: {
    apartmentName: string;
    image_urls: string[];
    description: string;
    location: string;
    price: number;
    contactNo: number;
    category: string;
    facility: string;
    availableFor: string;
    // other apartment details
  };
}

const ApartmentDetails: React.FC<ApartmentDetailsProps> = ({ data }) => {
  // Split the facility string into an array
  const facilityList = data.facility.split(", ");

  // Determine how many columns are needed
  const columns = Math.ceil(facilityList.length / 5);

  // Create an array of columns
  const facilityColumns = Array.from({ length: columns }, (_, columnIndex) =>
    facilityList.slice(columnIndex * 5, (columnIndex + 1) * 5)
  );

  return (
    <div className="bg-gradient-to-b from-[#00FFFF] to-[#009999] lg:w-3/4 p-5 rounded-lg shadow-lg w-full">
      <Swipper images={data.image_urls} />
      <div className="flex w-full justify-between mt-6">
        <div className="flex flex-col">
          <h1 className="lg:text-2xl text-lg font-bold">
            {data.apartmentName}
          </h1>
          <p className="lg:text-sm text-xs">{data.category}</p>
        </div>
        <p className="text-[#FF0000] font-semibold lg:text-2xl text-lg">
          Price: ${data.price}
        </p>
      </div>
      <p className="text-lg font-medium">Available For: {data.availableFor}</p>
      <p className="text-lg font-medium">Location: {data.location}</p>

      <div className="bg-gradient-to-b from-[#00FFFF] to-[#009999] w-full rounded-xl p-4 mt-12">
        <p className="text-lg font-medium mb-2">Facilities:</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
          {facilityColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col">
              {column.map((facility, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`facility-${columnIndex}-${index}`}
                    className="mr-2"
                    disabled
                  />
                  <label
                    htmlFor={`facility-${columnIndex}-${index}`}
                    className="text-lg"
                  >
                    {facility}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#00FFFF] to-[#009999] w-full rounded-xl p-4 mt-12">
        <p className="text-lg font-medium mb-2">Description:</p>

        {data.description}
      </div>
    </div>
  );
};

export default ApartmentDetails;
