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
        console.log("User Data", userContext?.userAuthData);
        toast.success(response.data.message);
        router.push("/");
      } else {
        setLoading(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something Went Wrong");
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
          <input
            type="email"
            placeholder="Email"
            className="border w-full px-2 text-sm rounded-md py-1"
            {...register("email", { required: "Email is required" })}
          />

          <input
            type="password"
            placeholder="Password"
            className="border w-full px-2 text-sm rounded-md py-1"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          <button
            type="submit"
            className="bg-[#68ACFD] w-full font-light text-lg text-white rounded-md py-1 hover:scale-105 transition-all duration-200"
          >
            LOGIN
          </button>
        </form>
      )}
      <ToastContainer />
    </>
  );
}
