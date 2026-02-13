import React from "react";
import Loading from "../loading";
import Spinner from "@/components/global/Spinner";

function page() {
  return (
    <div className="min-h-screen min-w-screen bg-white flex justify-center items-center">
      <Spinner />
    </div>
  );
}

export default page;
