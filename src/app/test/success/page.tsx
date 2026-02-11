"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import paymentSuccessAnimation from "../payment/paysuccess.json";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-36 h-36 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function Page() {
  const router = useRouter();
  const [redirectTime, setRedirectTime] = useState(6); // Initial countdown time
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setRedirectTime((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push("/profile");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval); // Cleanup interval on component unmount
  }, [router]);

  return (
    <div className="bg-gradient-to-b from-[#F8F8F8] to-[#00E0FF] min-w-screen min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center space-y-4 w-full max-w-md text-center">
        {isMounted ? (
          <Lottie
            animationData={paymentSuccessAnimation}
            loop={false}
            className="w-36 h-36"
          />
        ) : (
          <div className="w-36 h-36 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800">Payment Successful</h2>
        <p className="text-gray-600">
          Your apartment is under verification. It will be published after 4-5
          hours. If you have any questions, please reach out to{" "}
          <a
            href="mailto:support@vrental.in"
            className="text-blue-500 underline"
          >
            support@vrental.in
          </a>
          .
        </p>
        <p className="text-gray-500">
          Redirecting to your profile in{" "}
          <span className="font-semibold">{redirectTime}</span> seconds...
        </p>
      </div>
    </div>
  );
}
