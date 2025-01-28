import { Fullscreen } from "lucide-react";
import React from "react";
import Image from "next/image";

function Hero() {
  return (
    <div className="mt-12">
      {/* <div className="Hero lg:min-h-screen h-[254px] flex justify-center items-center"></div> */}
      <div className="md:px-10 md:py-10 px-2 py-4">
        {/* <video autoPlay muted loop src="/assets/video.mp4" /> */}
        <img src="/assets/heroImage.webp" alt="none" className="lg:max-w-[1200px] mx-auto rounded-xl max-h-[700px]"/>
        
      </div>
    </div>
  );
}

export default Hero;
