"use client";
import React, { useState } from "react";
import { FaHome, FaUser } from "react-icons/fa";
import { MdClose } from "react-icons/md";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: "USER" | "OWNER") => void;
  userName?: string;
}

export default function RoleSelectionModal({
  isOpen,
  onClose,
  onSelectRole,
  userName = "there",
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<"USER" | "OWNER" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    await onSelectRole(selectedRole);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 md:p-8 relative animate-slide-up max-h-[90vh] overflow-y-auto">
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
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl sm:text-3xl">👋</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 px-6">
            Welcome, {userName}!
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm px-4">
            Let us know how you&apos;ll be using VRENTAL
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          {/* Renter Option */}
          <button
            type="button"
            onClick={() => setSelectedRole("USER")}
            disabled={isSubmitting}
            className={`w-full p-3 sm:p-4 md:p-5 border-2 rounded-xl text-left transition-all duration-300 active:scale-95 sm:hover:scale-[1.02] ${
              selectedRole === "USER"
                ? "border-blue-600 bg-blue-50 shadow-lg"
                : "border-gray-200 hover:border-blue-300 hover:shadow-md"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedRole === "USER"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <FaUser className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-0.5 sm:mb-1">
                  I&apos;m looking to rent
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-tight sm:leading-normal">
                  Find your perfect room, flat, PG, or co-living space
                </p>
              </div>
              {selectedRole === "USER" && (
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>

          {/* Owner Option */}
          <button
            type="button"
            onClick={() => setSelectedRole("OWNER")}
            disabled={isSubmitting}
            className={`w-full p-3 sm:p-4 md:p-5 border-2 rounded-xl text-left transition-all duration-300 active:scale-95 sm:hover:scale-[1.02] ${
              selectedRole === "OWNER"
                ? "border-blue-600 bg-blue-50 shadow-lg"
                : "border-gray-200 hover:border-blue-300 hover:shadow-md"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedRole === "OWNER"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <FaHome className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-0.5 sm:mb-1">
                  I&apos;m a property owner
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-tight sm:leading-normal">
                  List your properties and connect with potential renters
                </p>
              </div>
              {selectedRole === "OWNER" && (
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedRole || isSubmitting}
          className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base text-white transition-all duration-300 transform active:scale-95 ${
            selectedRole && !isSubmitting
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 sm:hover:scale-[1.02] shadow-lg hover:shadow-xl"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm sm:text-base">Setting up your account...</span>
            </div>
          ) : (
            "Continue"
          )}
        </button>

        {/* Info Text */}
        <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4 px-2">
          You can change this later in your profile settings
        </p>
      </div>
    </div>
  );
}
