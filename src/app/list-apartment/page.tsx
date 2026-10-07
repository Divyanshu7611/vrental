"use client";
import React, { useEffect, useContext } from "react";
import Step1 from "@/components/Form/Step1";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldAlert, Home, ArrowRight } from "lucide-react";

const Page = () => {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const role = userContext?.userAuthData?.role;
  const canList = role === "OWNER" || role === "BROKER";

  useEffect(() => {
    if (!userContext?.userAuthData) {
      toast.error("Please login to list a property");
      router.push("/auth");
      return;
    }

    if (!canList) {
      toast.error("Only property owners and brokers can list properties");
    }
  }, [userContext?.userAuthData, router, canList]);

  if (userContext?.userAuthData && !canList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center border-2 border-red-100">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-10 h-10 text-red-600" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Access Restricted
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                Only property owners and verified brokers can list properties on VRENTAL.
              </p>

              <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  Want to list properties?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sign up as an Owner or Broker, or contact support to upgrade your account.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="mailto:support@vrental.in"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Contact Support
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/")}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Browse Properties
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 ml-0 sm:ml-3"
                >
                  Go to Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              List Your Property
            </h1>
            <p className="text-gray-600 text-lg">
              {role === "BROKER"
                ? "Brokers with an active plan can list up to 3 properties per month for free"
                : "Fill out the form below to get started"}
            </p>
          </div>
          <Step1 />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
