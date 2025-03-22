"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Signup from "./Signup";
import Login from "./Login";
import ResetPassword from "./ResetLink"; // Import the ResetPassword component
import { getAuth,signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/utilis/firebase";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export default function AuthMain() {
  const [view, setView] = useState<"signup" | "login" | "resetPassword">(
    "login"
  );

  // const auth = getAuth();
  const userContext = useContext(UserContext);
  const provider = new GoogleAuthProvider();
  async function handleGoogleLogin() {
    try {
    const result = await signInWithPopup(auth, provider)
    const token = await result.user.getIdToken()
    console.log("Auth user",token,result.user.email,result.user.displayName,result.user.photoURL,result.user.phoneNumber)

    const response = await axios.post('/api/auth/google',{token,email:result.user.email,displayName:result.user.displayName,photoUrl:result.user.photoURL,phoneNumber:1234567890})
    if(response.data.success){
      localStorage.setItem('token',token)
      userContext?.AuthDataHandler(response.data.data)
      window.location.href = '/'
    }
      
    } catch (error:any) {
      console.error("Google Sign-in Error:", error.message);
    }
    
  }
  return (
    <div className="flex flex-col gap-5 h-full px-2">
      <button
        className="w-full bg-[#434FAA] py-2 px-2 text-start text-white lg:text-md text-md flex justify-start items-center lg:gap-12 gap-6 hover:scale-105 transition-all duration-200 rounded-md"
        onClick={handleGoogleLogin}
      >
        <FcGoogle className="lg:text-xl text-lg" />
        Connect with Google
      </button>
      <div className="flex w-full justify-between gap-2 items-center">
        <span className="w-[150px] opacity-20 h-[1px] bg-black"></span>
        <div className="opacity-50 text-lg font-light italic">or</div>
        <span className="w-[150px] opacity-20 h-[1px] bg-black"></span>
      </div>

      {view === "signup" && <Signup />}
      {view === "login" && <Login />}
      {view === "resetPassword" && <ResetPassword />}

      {view === "login" ? (
        <>
          <a
            onClick={() => setView("signup")}
            className="text-sm text-blue-500 hover:underline cursor-pointer text-center"
          >
            Create New Account
          </a>
          <a
            onClick={() => setView("resetPassword")}
            className="text-sm text-blue-500 hover:underline cursor-pointer text-center"
          >
            Forgot Password?
          </a>
        </>
      ) : view === "signup" ? (
        <a
          onClick={() => setView("login")}
          className="text-sm text-blue-500 hover:underline cursor-pointer text-center"
        >
          Already have an account
        </a>
      ) : (
        <a
          onClick={() => setView("login")}
          className="text-sm text-blue-500 hover:underline cursor-pointer text-center"
        >
          Back to Login
        </a>
      )}
    </div>
  );
}
