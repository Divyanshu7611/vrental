import { FaHome, FaMapMarkerAlt, FaWifi, FaShieldAlt, FaFileContract, FaClipboardCheck } from "react-icons/fa";

const features = [
  {
    icon: <FaHome className="text-blue-500 text-3xl sm:text-4xl" />,
    title: "Diverse Property Listings",
    description: "Explore a wide range of accommodations, including rooms, hostels, PGs, flats, and co-living spaces, catering to various preferences and budgets.",
  },
  {
    icon: <FaMapMarkerAlt className="text-blue-500 text-3xl sm:text-4xl" />,
    title: "Prime Locations",
    description: "Our properties are strategically located near educational institutions, workplaces, and public transportation, ensuring convenience.",
  },
  {
    icon: <FaWifi className="text-blue-500 text-3xl sm:text-4xl" />,
    title: "Modern Amenities",
    description: "Enjoy facilities like high-speed internet, air conditioning, fully-equipped kitchens, and laundry services for a comfortable stay.",
  },
  {
    icon: <FaShieldAlt className="text-blue-500 text-3xl sm:text-4xl" />,
    title: "Enhanced Security",
    description: "We prioritize your safety with secure entry systems, surveillance cameras, and well-lit premises for a secure living environment.",
  },
  {
    icon: <FaFileContract className="text-blue-500 text-3xl sm:text-4xl" />,
    title: "Flexible Lease Options",
    description: "Offering various lease durations to accommodate short-term stays and long-term residencies, providing flexibility to suit your needs.",
  },
  {
    icon: <FaClipboardCheck className="text-blue-500 text-3xl sm:text-4xl" />,
    title: "Hassle-Free Booking",
    description: "Easily book your preferred rental online with a seamless and transparent process, ensuring a stress-free experience.",
  },
  
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-10 sm:py-14 md:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold md:text-start text-center text-black mb-6 sm:mb-10 leading-tight">
          Our Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-5 sm:p-6 flex flex-col items-center text-center">
              {feature.icon}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-3 sm:mt-4 leading-snug">{feature.title}</h3>
              <p className="text-gray-600 mt-2 text-sm sm:text-base leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
