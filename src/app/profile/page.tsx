"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import ProfileDetails from "@/components/Profile/ProfileDetails";
import ProfileRating from "@/components/Profile/ProfileRating";
import SmallCard from "@/components/mini/SmallCard";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileCard from "@/components/mini/profileCard";
import Spinner from "@/components/global/Spinner";
import { Home, TrendingUp, DollarSign, CheckCircle, Clock, Star, Award, BarChart3 } from "lucide-react";


export default function Page() {
  const [aparmentData, handleApartmentData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);
  const router = useRouter();
  
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

    if (userContext?.userAuthData?._id) {
      fetchData();
    } else {
      toast.error("Please login to access this page");
      router.push("/");
    }
  }, [userContext?.userAuthData?._id]);

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
                      Manage and view all your listed properties
                    </p>
                  </div>
                  {aparmentData.length > 0 && (
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
                      No Apartments Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start by listing your first property to get started.
                    </p>
                    <button
                      onClick={() => router.push("/list-apartment")}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Your First Property
                    </button>
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
        </div>
      )}
      <Footer />
      <ToastContainer />
    </div>
  );
}
