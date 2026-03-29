"use client";
import React, { useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import Signup from "./Signup";
import Login from "./Login";
import ResetPassword from "./ResetLink";
import RoleSelectionModal from "./RoleSelectionModal";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/utilis/firebase";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { toast } from "sonner";

export default function AuthMain() {
  const [view, setView] = useState<"signup" | "login" | "resetPassword">("login");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [googleAuthData, setGoogleAuthData] = useState<any>(null);
  const userContext = useContext(UserContext);
  const provider = new GoogleAuthProvider();

  async function handleGoogleLogin() {
    try {
      // Clear old localStorage data before login
      localStorage.removeItem("token");
      localStorage.removeItem("userAuthData");
      
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const response = await axios.post("/api/auth/google", {
        token,
        email: result.user.email,
        displayName: result.user.displayName,
        photoUrl: result.user.photoURL,
        phoneNumber: 1234567890,
      });

      if (response.data.success) {
        // Check if this is a new user
        if (response.data.isNewUser) {
          // Store the auth data temporarily and show role selection modal
          setGoogleAuthData({
            firebaseToken: token,
            jwtToken: response.data.token, // ��� Store JWT token
            email: result.user.email,
            displayName: result.user.displayName,
            photoUrl: result.user.photoURL,
            userData: response.data.data,
          });
          setShowRoleModal(true);
        } else {
          // Existing user - proceed with login
          // Clear any old data first
          localStorage.clear();
          
          // Save fresh data from database
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userAuthData", JSON.stringify(response.data.data));
          
          // Update context with fresh data
          userContext?.AuthDataHandler(response.data.data);
          
          toast.success(`Welcome back, ${response.data.data.firstName}!`);
          
          // Force reload to ensure context updates
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        }
      }
    } catch (error: any) {
      console.error("Google Sign-in Error:", error.message);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  }

  async function handleRoleSelection(role: "USER" | "OWNER") {
    try {
      if (!googleAuthData) return;

      // Update user role
      const response = await axios.post("/api/auth/google", {
        token: googleAuthData.firebaseToken, // ✅ Use Firebase token for verification
        email: googleAuthData.email,
        displayName: googleAuthData.displayName,
        photoUrl: googleAuthData.photoUrl,
        phoneNumber: 1234567890,
        role: role,
      });

      if (response.data.success) {
        // Clear any old data first
        localStorage.clear();
        
        // Save fresh data from database
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userAuthData", JSON.stringify(response.data.data));
        
        // Update context with fresh data
        userContext?.AuthDataHandler(response.data.data);
        setShowRoleModal(false);
        
        toast.success(`Welcome! Your account has been set up as ${role === "OWNER" ? "Property Owner" : "Renter"}`);
        
        // Force reload to ensure context updates
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (error: any) {
      console.error("Role Selection Error:", error.message);
      toast.error("Failed to set up your account. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">

      {/* Google Button */}

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {view === "signup" 
          ? "Create Your Account" 
          : view === "resetPassword"
          ? "Reset Password"
          : "Welcome Back"}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {view === "signup"
          ? "Sign up to get started with VRENTAL"
          : view === "resetPassword"
          ? "Enter your email to receive a reset link"
          : "Sign in to continue to your account"}
      </p>

      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 
        bg-white border border-gray-300 
        py-3 rounded-lg 
        shadow-sm hover:shadow-md 
        transition-all duration-300 
        hover:scale-[1.02]"
      >
        <FcGoogle className="text-xl" />
        <span className="font-medium text-gray-700">
          Continue with Google
        </span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-[1px] bg-gray-200"></div>
        <span className="text-sm text-gray-400 font-medium">OR</span>
        <div className="flex-1 h-[1px] bg-gray-200"></div>
      </div>

      {/* Form Section */}
      <div className="space-y-4">
        {view === "signup" && <Signup />}
        {view === "login" && <Login />}
        {view === "resetPassword" && <ResetPassword />}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-3 pt-2 text-center">

        {view === "login" && (
          <>
            <button
              onClick={() => setView("signup")}
              className="text-sm text-blue-600 font-medium hover:text-blue-700 transition"
            >
              Create a new account
            </button>

            <button
              onClick={() => setView("resetPassword")}
              className="text-sm text-gray-500 hover:text-blue-600 transition"
            >
              Forgot password?
            </button>
          </>
        )}

        {view === "signup" && (
          <button
            onClick={() => setView("login")}
            className="text-sm text-blue-600 font-medium hover:text-blue-700 transition"
          >
            Already have an account?
          </button>
        )}

        {view === "resetPassword" && (
          <button
            onClick={() => setView("login")}
            className="text-sm text-blue-600 font-medium hover:text-blue-700 transition"
          >
            Back to Login
          </button>
        )}

      </div>

      {/* Role Selection Modal for New Google Users */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => {
          // Don't allow closing without selecting a role for new users
          // setShowRoleModal(false);
        }}
        onSelectRole={handleRoleSelection}
        userName={googleAuthData?.displayName?.split(' ')[0] || "there"}
      />
    </div>
  );
}
