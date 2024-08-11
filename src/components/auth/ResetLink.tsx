"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "../global/Spinner";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface FormValues {
  email: string;
}

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/reset-password", data);
      setLoading(false);
      if (response.data.success) {
        toast.success("Reset link sent to your email.");
      } else {
        toast.error("Failed to send reset link.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (errors.email) {
      toast.error(errors.email.message);
    }
  }, [errors]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border w-full px-2 text-sm rounded-md py-1"
            {...register("email", { required: "Email is required" })}
          />

          <button
            type="submit"
            className="bg-[#68ACFD] w-full font-light text-lg text-white rounded-md py-1 hover:scale-105 transition-all duration-200"
          >
            SEND RESET LINK
          </button>
        </form>
      )}
      <ToastContainer />
    </>
  );
}
