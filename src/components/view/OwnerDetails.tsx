import React from "react";

interface OwnerDetailsProps {
  data: {
    firstName: string;
    lastName: string;
    image: string;
  };
}

const OwnerDetails: React.FC<OwnerDetailsProps> = ({ data }) => {
  return (
    <div className="lg:w-1/4 flex lg:flex-col items-center flex-row gap-5">
      <div className="flex flex-col justify-center items-center">
        <img
          src={data.image}
          alt="Owner"
          height={200}
          width={200}
          className="rounded-full border-[10px] border-gradient-to-b from-[#00F0FF] to-[#00666D] mb-4"
        />

        <h2 className="lg:text-xl text-lg font-semibold mb-2 text-center">
          {data.firstName} {data.lastName}
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        <a href="tel:9950156755">
          <button className="mb-2 bg-[#00F0FF] border border-black rounded-2xl text-black font-semibold py-2 px-8 hover:scale-105 transition-all w-full">
            Call Now
          </button>
        </a>
        <a>
          <button className="mb-2 bg-[#00F0FF] border border-black rounded-2xl text-black font-semibold py-2 px-8 hover:scale-105 transition-all w-full">
            Save
          </button>
        </a>
        <a>
          <button className="bg-[#00F0FF] border border-black rounded-2xl text-black font-semibold py-2 px-8 hover:scale-105 transition-all w-full">
            Interested
          </button>
        </a>
      </div>
    </div>
  );
};

export default OwnerDetails;
