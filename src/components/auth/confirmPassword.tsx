"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "@/components/global/Spinner";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/router";

interface FormValues {
  password: string;
  confirmPassword: string;
}

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = router.query; // Extract the token from the URL

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/confirm-password", {
        token, // Include the token in the request
        password: data.password,
      });
      setLoading(false);
      if (response.data.success) {
        toast.success("Password has been successfully updated.");
        router.push("/login"); // Redirect to login page after success
      } else {
        toast.error(response.data.message || "Failed to update password.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    Object.values(errors).forEach((error) => {
      if (error.message) {
        toast.error(error.message);
      }
    });
  }, [errors]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            className="border w-full px-2 text-sm rounded-md py-1"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="border w-full px-2 text-sm rounded-md py-1"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />

          <button
            type="submit"
            className="bg-[#68ACFD] w-full font-light text-lg text-white rounded-md py-1 hover:scale-105 transition-all duration-200"
          >
            Confirm Password
          </button>
        </form>
      )}
      <ToastContainer />
    </>
  );
}
