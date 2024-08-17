"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "../global/Spinner";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { response } from "express";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  otp: string;
  adharNo: string;
}

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValues>();
  const router = useRouter();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otp, setOTP] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }
    console.log(data);
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/register", data);
      if (response.data.success) {
        setLoading(false);
        toast.success(response.data.message);
        router.push("/auth");
      } else {
        setLoading(false);
        toast.error("User Already Exist");
      }
    } catch (error: any) {
      setLoading(false);
      toast.error("Something Went Wrong", error);
    }
  };

  useEffect(() => {
    // Type assertion for `errors` to match FieldErrors type
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

  const validateEmail = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/otp", { email });
      if (response.data.success) {
        setOTP(response.data.otp);
        setLoading(false);
        setIsEmailSent(true);
        startCountdown();
        toast.success("OTP sent to your email");
      } else {
        setLoading(false);
        toast.error("Failed to send OTP");
      }
    } catch (error: any) {
      setLoading(false);
      toast.error("An error occurred while sending OTP", error);
    }
  };

  const verifyOtp = () => {
    if (otp === enteredOtp) {
      toast.success("OTP verified successfully");
      setIsOtpVerified(true);
    } else {
      toast.error("Invalid OTP");
    }
  };

  const startCountdown = () => {
    setCountdown(90); // 1.5 minutes = 90 seconds
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("firstName", { required: "First name is required" })}
            className="border w-full px-2 text-sm rounded-md py-2"
            placeholder="First Name"
          />

          <input
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Last Name"
            className="border w-full px-2 text-sm rounded-md py-2"
          />

          <input
            type="email"
            placeholder="Email"
            className="border w-full px-2 text-sm rounded-md py-2"
            {...register("email", { required: "Email is required" })}
            disabled={isOtpVerified} // Disable email input if OTP is verified
          />
          {!isOtpVerified && (
            <div>
              <button
                type="button"
                onClick={validateEmail}
                disabled={countdown > 0}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:scale-105 transition-all duration-200 font-light text-sm"
              >
                {countdown > 0
                  ? `Resend OTP (${countdown}s)`
                  : "Validate Email"}
              </button>
            </div>
          )}

          {isEmailSent && !isOtpVerified && (
            <>
              <input
                type="text"
                placeholder="OTP"
                className="border w-full px-2 text-sm rounded-md py-2"
                {...register("otp", {
                  required: "OTP is required",
                  minLength: {
                    value: 6,
                    message: "OTP must be at least 6 characters",
                  },
                })}
                onChange={(e) => setEnteredOtp(e.target.value)}
              />
              <div>
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:scale-105 transition-all duration-200 font-light text-sm"
                >
                  Verify OTP
                </button>
              </div>
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            className="border w-full px-2 text-sm rounded-md py-2"
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
            className="border w-full px-2 text-sm rounded-md py-2"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              minLength: {
                value: 6,
                message: "Confirm Password must be at least 6 characters",
              },
            })}
          />

          <input
            type="tel"
            className="border w-full px-2 text-sm rounded-md py-2"
            placeholder="Phone No"
            {...register("phone", {
              required: "Phone number is required",
              minLength: {
                value: 10,
                message: "Phone number must be 10 digits",
              },
              maxLength: {
                value: 10,
                message: "Phone number must be 10 digits",
              },
            })}
          />

          <input
            type="text"
            placeholder="Aadhar No"
            className="border w-full px-2 text-sm rounded-md py-2"
            {...register("adharNo", {
              required: "Aadhar number is required",
              minLength: {
                value: 12,
                message: "Aadhar number must be 12 digits",
              },
              maxLength: {
                value: 12,
                message: "Aadhar number must be 12 digits",
              },
            })}
          />

          <button
            type="submit"
            className="bg-[#68ACFD] w-full font-light text-lg text-white rounded-md py-2 hover:scale-105 transition-all duration-200"
          >
            SIGN UP
          </button>
        </form>
      )}
      <ToastContainer />
    </>
  );
}
