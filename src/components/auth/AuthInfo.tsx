import React from "react";
import Image from "next/image";
import AuthIcons from "../mini/AuthIcons";

export default function AuthInfo() {
  return (
    <div className="max-w-[570px] ">
      <Image
        src="/assets/Logo.png"
        alt="Vrental"
        width={153}
        height={152}
        className="mx-auto"
      />
      <div className="flex flex-col gap-5">
        <h3 className="text-lg font-normal text-center">
          Why should I Join Vrental?
        </h3>
        <p className="font-light text-lg opacity-50 text-center">
          To have the experience of “property”, “information” and “trust” in the
          real estate world all together…
        </p>
        <div className="flex flex-col justify-between items-center gap-10">
          <div className="mx-auto flex gap-10 justify-between">
            <AuthIcons
              icon="/authIcons/icon1.png"
              description="Learn about location."
            />
            <AuthIcons
              icon="/authIcons/icon2.png"
              description="Find out the value of your house free of charge. "
            />
          </div>
          <div className="mx-auto flex gap-10 justify-between">
            <AuthIcons
              icon="/authIcons/icon3.png"
              description="Discover houses that will improve your life quality."
            />
            <AuthIcons
              icon="/authIcons/icon4.png"
              description="Be aware of new projects."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
