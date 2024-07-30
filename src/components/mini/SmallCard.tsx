import React from "react";
import Image from "next/image";

interface ICardDetails {
  price: number;
  timePeriod: string;
  category: string;
  address: string;
  date: string;
  size: string;
  image: string;
}

const SmallCard: React.FC<ICardDetails> = ({
  price,
  timePeriod,
  category,
  address,
  date,
  size,
  image,
}) => {
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
        <h3 className="text-sm">{category} for Rent</h3>
        <h3 className="text-[10px] text-[#000000] opacity-50">{address}</h3>
        <h3 className="text-[10px] text-[#000000] opacity-50">{date}</h3>
        <h3 className="text-[10px]">{size}</h3>
      </div>
    </div>
  );
};

export default SmallCard;
