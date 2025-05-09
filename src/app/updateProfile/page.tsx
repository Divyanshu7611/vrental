"use client";
import React, { useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "@/context/UserContext";
import { headers } from "next/headers";

export default function UpdateProfile() {
  const userContext = useContext(UserContext);

  const [phone, setPhone] = useState(0);
  const [profession, setProfession] = useState("");
  const [age, setAge] = useState(0);
  const [bio, setBio] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [token, setToken] = useState<string | null>(null); // State for storing token

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/");
    } else {
      setToken(storedToken);
      // console.log("Token is", storedToken);
    }
  }, [router]);

  useEffect(() => {
    if (userContext?.userAuthData) {
      setPhone(userContext.userAuthData.phone || 0);
      setProfession(userContext.userAuthData.profession || "");
      setAge(userContext.userAuthData.age || 0);
      setBio(userContext.userAuthData.bio || "");
      setFirstName(userContext.userAuthData.firstName || "");
      setLastName(userContext.userAuthData.lastName || "");
    }
  }, [userContext]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return; // Ensure the token is present before proceeding
    try {
      setIsLoading(true);
      const response = await axios.put(
        `/api/auth/updateProfile?id=${userId}`,
        {
          phone,
          profession,
          age,
          bio,
          firstName,
          lastName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile Updated Successfully");
        userContext?.AuthDataHandler(response.data.User);
        router.push("/profile"); // Redirect to the profile page or any other page
      } else {
        toast.error(response.data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF]">
      {isLoading ? (
        <div className="min-w-screen min-h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 border bg-white lg:p-10 p-3 py-8 mx-2 rounded-2xl shadow-lg shadow-cyan-300"
          >
            <h1 className="font-semibold text-xl">Profile Update</h1>
            <input
              type="text"
              placeholder="First Name"
              className="border w-full px-2 text-sm rounded-md py-1 border-gray-400"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border w-full px-2 text-sm rounded-md py-1 border-gray-400"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Phone"
              className="border w-full px-2 text-sm rounded-md py-1 border-gray-400"
              value={phone}
              onChange={(e) => setPhone(Number(e.target.value))}
              required
            />
            <input
              type="text"
              placeholder="Profession"
              className="border w-full px-2 text-sm rounded-md py-1 border-gray-400"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Age"
              className="border w-full px-2 text-sm rounded-md py-1 border-gray-400"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              required
            />
            <textarea
              placeholder="Bio"
              className="border w-full px-2 text-sm rounded-md py-1 border-gray-400"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-[#68ACFD] w-full text-lg text-white font-normal rounded-md py-1 hover:scale-105 transition-all duration-200"
            >
              Update Profile
            </button>
          </form>
          <ToastContainer />
        </div>
      )}
    </div>
  );
}
