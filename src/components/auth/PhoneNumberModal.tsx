"use client";
import React, { useState } from "react";
import { MdClose, MdPhone } from "react-icons/md";

interface PhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => void;
  userName?: string;
  isSubmitting?: boolean;
}

export default function PhoneNumberModal({
  isOpen,
  onClose,
  onSubmit,
  userName = "there",
  isSubmitting = false,
}: PhoneNumberModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const validatePhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, "");
    
    // Check if it's a valid 10-digit Indian phone number
    if (cleaned.length !== 10) {
      return "Please enter a valid 10-digit phone number";
    }
    
    // Check if it starts with 6, 7, 8, or 9 (valid Indian mobile numbers)
    if (!["6", "7", "8", "9"].includes(cleaned[0])) {
      return "Phone number must start with 6, 7, 8, or 9";
    }
    
    return "";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError("");
    }
  };

  const handleSubmit = () => {
    const validationError = validatePhoneNumber(phoneNumber);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSubmit(phoneNumber);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && phoneNumber.length === 10) {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 md:p-8 relative animate-slide-up">
        {/* Close button - only show if not submitting */}
        {!isSubmitting && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <MdClose className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto flex items-center justify-center">
              <MdPhone className="text-white text-2xl sm:text-3xl" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 px-6">
            One Last Step, {userName}!
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm px-4">
            Please provide your mobile number to complete your profile
          </p>
        </div>

        {/* Phone Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm font-medium">+91</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter 10-digit mobile number"
              disabled={isSubmitting}
              className={`w-full pl-14 pr-4 py-3 border-2 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
              } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
              maxLength={10}
              autoFocus
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            We'll use this to keep you updated about your bookings
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={phoneNumber.length !== 10 || isSubmitting}
          className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base text-white transition-all duration-300 transform active:scale-95 ${
            phoneNumber.length === 10 && !isSubmitting
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 sm:hover:scale-[1.02] shadow-lg hover:shadow-xl"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm sm:text-base">Completing setup...</span>
            </div>
          ) : (
            "Complete Setup"
          )}
        </button>

        {/* Info Text */}
        <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4 px-2">
          Your phone number will be kept private and secure
        </p>
      </div>
    </div>
  );
}
