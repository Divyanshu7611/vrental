"use client";
import React, { useState, useEffect, useContext } from "react";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "../global/Spinner";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValues>();

  const [isLoading, setLoading] = useState(false);
  const userContext = useContext(UserContext);
  const router = useRouter();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", data);
      if (response.data.success) {
        setLoading(false);
        const token = response.data.token;
        localStorage.setItem("token", token);
        userContext?.AuthDataHandler(response.data.existingUser);

        toast.success(response.data.message);
        router.push("/");
      } else {
        setLoading(false);
        toast.error(response.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error("Something Went Wrong", error);
    }
  };

  useEffect(() => {
    Object.values(errors).forEach((error: any) => {
      if (error.message) {
        toast.error(error.message);
      } else if (error.type === "minLength" && error.ref) {
        toast.error(
          `${error.ref.name} must be at least ${error.ref.minLength} characters`
        );
      } else if (error.type === "maxLength" && error.ref) {
        toast.error(
          `${error.ref.name} must be at most ${error.ref.maxLength} characters`
        );
      }
    });
  }, [errors]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none text-sm"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none text-sm"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 w-full font-semibold text-base text-white rounded-lg py-3 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
        </form>
      )}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
