"use client";
import React, { useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import Image from "next/image";

export default function ProfileDetails() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const userContext = useContext(UserContext);

  useEffect(() => {
    if (!userContext?.userAuthData) {
      router.push("/auth");
    }
  }, [userContext?.userAuthData]);

  return (
    <div className="max-w-[1080px] mx-auto flex justify-between w-full mt-20 mb-10 px-1">
      <div className="flex flex-col justify-center items-start">
        <div>
          <h1 className="lg:text-3xl text-2xl font-semibold">
            {userContext?.userAuthData?.clientID}
          </h1>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="lg:text-2xl text-base font-medium">
            Name:{userContext?.userAuthData?.firstName}
          </h1>
          <h1 className="lg:text-2xl text-base font-medium">
            Age:{userContext?.userAuthData?.age}
          </h1>
          <h1 className="lg:text-2xl text-base font-medium">
            Profession :{userContext?.userAuthData?.profession}
          </h1>
          <h1 className="lg:text-2xl text-base font-medium">
            Bio : {userContext?.userAuthData?.bio}
          </h1>
        </div>
      </div>
      <div>
        <img
          src={`https://api.dicebear.com/5.x/initials/svg?seed=${userContext?.userAuthData?.firstName} ${userContext?.userAuthData?.lastName}&backgroundColor=418FA9`}
          alt=""
          width={180}
          height={180}
          className="rounded-full border-[10px] border-gradient-to-b from-[#00F0FF] to-[#00666D]"
        />
      </div>
    </div>
  );
}
