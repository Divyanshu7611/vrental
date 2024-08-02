"use client";
import React from "react";
import { useFormContext } from "react-hook-form";

const Step2: React.FC = () => {
  const { register } = useFormContext();
  return (
    <div>
      <h2>Step 2</h2>
      <div>
        <label>Email</label>
        <input {...register("email")} />
      </div>
      <div>
        <label>Phone Number</label>
        <input {...register("phone")} />
      </div>
    </div>
  );
};

export default Step2;
