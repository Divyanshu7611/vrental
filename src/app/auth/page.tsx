import React from "react";
import AuthInfo from "@/components/auth/AuthInfo";
import AuthMain from "@/components/auth/AuthMain";

export default function Page() {
  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF] flex justify-center items-center">
      <div className="max-w-[1200px] w-full h-full rounded-lg justify-between flex lg:flex-row flex-col-reverse bg-white p-10">
        {/* AuthInfo component is hidden on screens smaller than 'lg' */}
        <div className="hidden lg:block lg:w-3/4 lg:opacity-100 opacity-0">
          <AuthInfo />
        </div>
        <div className="bg-black opacity-10 w-[1px] min-h-[100%] mr-5"></div>
        <div className="lg:w-1/3">
          <AuthMain />
        </div>
      </div>
    </div>
  );
}
