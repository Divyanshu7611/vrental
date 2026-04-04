"use client";
import React from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import ReferralDashboard from "@/components/Profile/ReferralDashboard";

export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar />
      <div className="pt-24 pb-12">
        <ReferralDashboard />
      </div>
      <Footer />
    </div>
  );
}
