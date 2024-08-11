"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "@/components/global/Spinner";
import "react-toastify/dist/ReactToastify.css";

export default function ConfirmPassword() {
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const resetToken = searchParams.get("user");

  // Basic security: If no user token, redirect to 404
  if (!resetToken) {
    router.push("/404");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/update-password", {
        newPassword,
        resetToken,
      });

      if (response.data.success) {
        toast.success("Password reset successful");
        router.push("/auth");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      <div className="w-full max-w-md">
        {isLoading ? (
          <Spinner />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 border lg:p-10 p-5 bg-white rounded-2xl m-5 max-w-[350px] mx-auto"
          >
            <h1 className="font-semibold text-xl">Change Password</h1>
            <input
              type="password"
              placeholder="New Password"
              className="border w-full px-2 text-sm rounded-md py-1"
              value={newPassword}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="border w-full px-2 text-sm rounded-md py-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-[#68ACFD] w-full font-light text-lg text-white rounded-md py-1 hover:scale-105 transition-all duration-200"
            >
              Reset Password
            </button>
          </form>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
