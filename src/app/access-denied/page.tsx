"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { ShieldAlert, Home, ArrowRight, ArrowLeft, Mail } from "lucide-react";

export default function AccessDeniedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reason, setReason] = useState("");
  const [fromPath, setFromPath] = useState("");

  useEffect(() => {
    setReason(searchParams.get("reason") || "");
    setFromPath(searchParams.get("from") || "");
  }, [searchParams]);

  const getTitle = () => {
    if (reason === "owner_only") {
      return "Property Owner Access Required";
    }
    return "Access Denied";
  };

  const getMessage = () => {
    if (reason === "owner_only") {
      return "This feature is exclusively available to property owners. Upgrade your account to start listing properties.";
    }
    return "You don't have permission to access this page.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center border-2 border-red-100">
            {/* Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <ShieldAlert className="w-12 h-12 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {getTitle()}
            </h1>

            {/* Message */}
            <p className="text-lg text-gray-600 mb-8">
              {getMessage()}
            </p>

            {/* Info Box */}
            {reason === "owner_only" && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-center gap-2 text-lg">
                  <Home className="w-6 h-6 text-blue-600" />
                  Become a Property Owner
                </h3>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Join thousands of property owners on VRENTAL. List your properties, 
                  earn from referrals, and manage your rentals all in one place.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Benefits of OWNER Account:</h4>
                  <ul className="text-sm text-gray-600 space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">✓</span>
                      <span>List unlimited properties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">✓</span>
                      <span>Earn referral points and withdraw earnings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">✓</span>
                      <span>Access to property management dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">✓</span>
                      <span>Priority support and verification</span>
                    </li>
                  </ul>
                </div>

                <a
                  href="mailto:support@vrental.in?subject=Upgrade to Property Owner Account"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  Contact Support to Upgrade
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Home className="w-4 h-4" />
                Browse Properties
              </button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help? Contact us at{" "}
                <a
                  href="mailto:support@vrental.in"
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  support@vrental.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
