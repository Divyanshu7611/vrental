import React, { Suspense } from "react";
import Hero from "@/components/HomePage/Hero";
import CategoryShowcase from "@/components/HomePage/CategoryShowcase";
import Loading from "./loading";
import MapAd from "@/components/HomePage/MapAd";
import Footer from "@/components/global/Footer";
import FlatCard from "@/components/mini/FlatCard";
import Navbar from "@/components/global/Navbar";
import HomeFlat from "@/components/mini/HomeFlat";

function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen min-w-screen flex flex-col">
        <Navbar />
        <Hero />
        <div className="bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
          <div className="max-w-[1200px] mx-auto mt-10">
            <CategoryShowcase categories="Rooms" />
            <CategoryShowcase categories="Hostels" />
            <MapAd />
            <HomeFlat
              title="Lotus Flats"
              description="Enjoy stunning city views from this modern loft with open space."
              location="Rohini Sector, New Delhi"
              price="₹40,000/month"
              image="/assets/flat.png"
              category="FLAT"
              flexProp="row"
            />
          </div>
        </div>
        <Footer />
      </div>
    </Suspense>
  );
}

export default Home;
