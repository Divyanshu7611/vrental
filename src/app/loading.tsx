import React from "react";
import Spinner from "@/components/global/Spinner";

function loading() {
  return (
    <div className="min-w-screen min-h-screen bg-white flex justify-center items-center">
      <Spinner />
    </div>
  );
}

export default loading;
