"use client";
import React, { Suspense, useEffect, useState } from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import ProfileDetails from "@/components/Profile/ProfileDetails";
import ProfileRating from "@/components/Profile/ProfileRating";
import UserProfileDashboard from "@/components/Profile/UserProfileDashboard";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileCard from "@/components/mini/profileCard";
import Spinner from "@/components/global/Spinner";
import MessageNotifications from "@/components/Profile/MessageNotifications";
import ReferralDashboard from "@/components/Profile/ReferralDashboard";
import { Home, TrendingUp, DollarSign, CheckCircle, Clock, Award, BarChart3, Gift, Wallet, LayoutGrid } from "lucide-react";
import { MIN_REFERRAL_WITHDRAWAL_POINTS } from "@/lib/referralConstants";


function ProfilePageContent() {
  const [aparmentData, handleApartmentData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [referralStats, setReferralStats] = useState<any>(null);
  const [loadingReferral, setLoadingReferral] = useState(true);
  const [profileTab, setProfileTab] = useState<"overview" | "referrals">(() => {
    if (typeof window === "undefined") return "overview";
    return new URLSearchParams(window.location.search).get("tab") === "referrals"
      ? "referrals"
      : "overview";
  });
  const userContext = useContext(UserContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = searchParams.get("tab");
    setProfileTab(t === "referrals" ? "referrals" : "overview");
  }, [searchParams]);

  const goProfileTab = (t: "overview" | "referrals") => {
    setProfileTab(t);
    if (t === "referrals") {
      router.replace("/profile?tab=referrals", { scroll: false });
    } else {
      router.replace("/profile", { scroll: false });
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/aparment/apartments?id=${userContext?.userAuthData?._id}`
        );
        if (response) {
          setLoading(false);
          handleApartmentData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchReferralStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/referral/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setReferralStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching referral stats:", error);
      } finally {
        setLoadingReferral(false);
      }
    };

    if (userContext?.userAuthData?._id) {
      fetchData();
      const r = userContext?.userAuthData?.role;
      if (r === "OWNER" || r === "USER") {
        fetchReferralStats();
      } else {
        setLoadingReferral(false);
      }
    } else {
      toast.error("Please login to access this page");
      router.push("/");
    }
  }, [userContext?.userAuthData?._id, userContext?.userAuthData?.role]);

  // Calculate statistics
  const totalApartments = aparmentData.length;
  const activeApartments = aparmentData.filter((apt: any) => apt.status === 'active' || apt.status === 'verified').length;
  const totalValue = aparmentData.reduce((sum: number, apt: any) => sum + (apt.price || 0), 0);
  const averagePrice = totalApartments > 0 ? Math.round(totalValue / totalApartments) : 0;
  
  // Calculate profile completion
  const profileFields = [
    userContext?.userAuthData?.firstName,
    userContext?.userAuthData?.lastName,
    userContext?.userAuthData?.email,
    userContext?.userAuthData?.phone,
    userContext?.userAuthData?.age,
    userContext?.userAuthData?.profession,
    userContext?.userAuthData?.bio,
  ];
  const completedFields = profileFields.filter(field => field && field !== '').length;
  const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

  // Check if user is OWNER or regular USER
  const isOwner = userContext?.userAuthData?.role === "OWNER";
  const isBroker = userContext?.userAuthData?.role === "BROKER";
  const canManageListings = isOwner || isBroker;
  const showReferralTabs =
    userContext?.userAuthData?.role === "OWNER" || userContext?.userAuthData?.role === "USER";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar />
      {loading ? (
        <div className="min-h-screen bg-white flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-full">
          {/* Profile Header Section */}
          <div className="w-full bg-white">
            <ProfileDetails />
          </div>

          {showReferralTabs && (
            <div className="w-full border-b border-gray-200 bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 py-2">
                <button
                  type="button"
                  onClick={() => goProfileTab("overview")}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    profileTab === "overview"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => goProfileTab("referrals")}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    profileTab === "referrals"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Gift className="h-4 w-4" />
                  Referrals
                </button>
              </div>
            </div>
          )}

          {/* Conditional Rendering Based on Role */}
          {!canManageListings ? (
            <>
              {profileTab === "overview" && (
                <>
                  <UserProfileDashboard />
                  <div className="w-full py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto">
                      <MessageNotifications />
                    </div>
                  </div>
                </>
              )}
              {profileTab === "referrals" && showReferralTabs && (
                <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto">
                    <ReferralDashboard embedded />
                  </div>
                </div>
              )}
            </>
          ) : profileTab === "referrals" && showReferralTabs ? (
            <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <ReferralDashboard embedded />
              </div>
            </div>
          ) : (
            // OWNER Profile Dashboard (Original)
            <>

          {/* Statistics Dashboard Section */}
          <div className="w-full bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/50 py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section */}
              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {userContext?.userAuthData?.firstName}! 👋
                </h2>
                <p className="text-gray-600">Here&apos;s an overview of your account</p>
              </div>

              {/* Statistics Cards Grid */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${userContext?.userAuthData?.role === "OWNER" && referralStats ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-4 sm:gap-6 mb-8`}>
                {/* Total Properties Card */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Total</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalApartments}</h3>
                  <p className="text-sm text-gray-600">Properties Listed</p>
                </div>

                {/* Active Listings Card */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{activeApartments}</h3>
                  <p className="text-sm text-gray-600">Active Listings</p>
                </div>

                {/* Total Value Card */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Value</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">₹{totalValue.toLocaleString()}</h3>
                  <p className="text-sm text-gray-600">Total Monthly Value</p>
                </div>

                {/* Average Price Card */}
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Avg</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">₹{averagePrice.toLocaleString()}</h3>
                  <p className="text-sm text-gray-600">Average Price/Month</p>
                </div>

                {/* Referral Points Card - Only for Owners */}
                {userContext?.userAuthData?.role === "OWNER" && !loadingReferral && (
                  <div 
                    onClick={() => goProfileTab("referrals")}
                    className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          Rewards
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                        {referralStats?.referralPoints || 0}
                        <span className="text-lg font-normal opacity-90">pts</span>
                      </h3>
                      <p className="text-sm text-white/90 mb-2">Referral Points</p>
                      <div className="flex items-center gap-2 text-xs text-white/80">
                        <Wallet className="w-3 h-3" />
                        <span>= ₹{referralStats?.referralPoints || 0}</span>
                      </div>
                      {referralStats && referralStats.referralPoints >= MIN_REFERRAL_WITHDRAWAL_POINTS ? (
                        <div className="mt-3 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Can Withdraw
                        </div>
                      ) : (
                        <div className="mt-3 px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white/70 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {MIN_REFERRAL_WITHDRAWAL_POINTS - (referralStats?.referralPoints || 0)} pts to withdraw
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Completion & Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Completion Card */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Profile Completion</h3>
                        <p className="text-xs text-gray-500">Complete your profile for better visibility</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  {profileCompletion < 100 && (
                    <button
                      onClick={() => router.push(`/updateProfile?id=${userContext?.userAuthData?._id}`)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
                    >
                      Complete your profile →
                    </button>
                  )}
                </div>

                {/* Quick Stats Card */}
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 shadow-lg text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Account Status</h3>
                      <p className="text-xs text-blue-100">Your account overview</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-100">Member Since</span>
                      <span className="text-sm font-semibold">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-100">Properties</span>
                      <span className="text-sm font-semibold">{totalApartments} Listed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-100">Status</span>
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="w-full bg-gradient-to-br from-white to-blue-50 py-8 border-b border-gray-100">
            <ProfileRating />
          </div>

          {/* Message Notifications Section (for All Users) */}
          <div className="w-full py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
              <MessageNotifications />
            </div>
          </div>

          {/* Apartments Section */}
              <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <span>My Apartments</span>
                      {aparmentData.length > 0 && (
                        <span className="text-lg sm:text-xl font-normal text-gray-500">
                          ({aparmentData.length})
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Manage and view all your listed properties. Listings you left on the payment step appear here as
                      drafts — use Continue Payment to finish checkout.
                    </p>
                  </div>
                  {aparmentData.length > 0 && canManageListings && (
                    <button
                      onClick={() => router.push("/list-apartment")}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Property
                    </button>
                  )}
                </div>
                {aparmentData.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                      {aparmentData.length} {aparmentData.length === 1 ? 'Property' : 'Properties'} Listed
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      {activeApartments} Active
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                      <DollarSign className="w-4 h-4" />
                      ₹{totalValue.toLocaleString()}/month total
                    </div>
                  </div>
                )}
              </div>

              {/* Apartments Grid */}
              {aparmentData.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {canManageListings ? "No Apartments Yet" : "No Properties Listed"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {canManageListings
                        ? isBroker
                          ? "Purchase an active broker plan to list up to 3 properties per month."
                          : "Start by listing your first property to get started."
                        : "You haven't listed any properties yet. Browse available properties to find your perfect home."}
                    </p>
                    {canManageListings ? (
                      <button
                        onClick={() => router.push("/list-apartment")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Your First Property
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push("/")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Browse Properties
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {aparmentData.map(
                    (data: any, index: React.Key | null | undefined) => (
                      <ProfileCard
                        key={index}
                        price={data.price}
                        timePeriod="Month"
                        status={data.status}
                        category={data.category}
                        id={data._id}
                        address={data.address}
                        image={data.image_urls[0]}
                        apartmentName={data.apartmentName}
                        description={data.description}
                        facility={data.facility}
                        furniture={data.furniture}
                        location={data.location}
                        availableFor={data.availableFor}
                        paymentStatus={data.paymentStatus}
                      />
                    )
                  )}
                </div>
              )}
              </div>
            </div>
            </>
          )}
        </div>
      )}
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Spinner />
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
