"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import paymentSuccessAnimation from "../payment/paysuccess.json";

export default function Page() {
  const router = useRouter();
  const [redirectTime, setRedirectTime] = useState(6); // Initial countdown time

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
        <Lottie
          animationData={paymentSuccessAnimation}
          loop={false}
          className="w-36 h-36"
        />
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
