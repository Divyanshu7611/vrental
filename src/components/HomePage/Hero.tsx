import React from "react";

function Hero() {
  return (
    <div className="mt-12">
      {/* <div className="Hero lg:min-h-screen h-[254px] flex justify-center items-center"></div> */}
      <div>
        <video autoPlay muted loop src="/assets/video.mp4" />
      </div>
    </div>
  );
}

export default Hero;
