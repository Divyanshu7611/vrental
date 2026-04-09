"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { 
  Heart, 
  Search, 
  MapPin, 
  Calendar, 
  TrendingUp,
  Award,
  BarChart3,
  Eye,
  Home as HomeIcon,
  Mail,
  Phone,
  User,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfileDashboard() {
  const router = useRouter();
  const userContext = useContext(UserContext);

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

  const savedListingsCount = userContext?.wishlist
    ? Object.values(userContext.wishlist).filter((item) => item && item.id).length
    : 0;

  return (
    <div className="w-full bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center sm:text-left"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userContext?.userAuthData?.firstName}! 👋
          </h2>
          <p className="text-gray-600 text-lg">Your personal rental journey dashboard</p>
        </motion.div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Saved listings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => router.push("/wishlist")}
            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  Saved
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {savedListingsCount}
              </h3>
              <p className="text-sm text-white/90">Saved listings</p>
            </div>
          </motion.div>

          {/* Profile Completion Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => router.push(`/updateProfile?id=${userContext?.userAuthData?._id}`)}
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                Profile
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{profileCompletion}%</h3>
            <p className="text-sm text-white/90">Profile Complete</p>
          </motion.div>

          {/* Browse Properties Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.push("/")}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                Explore
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">1000+</h3>
            <p className="text-sm text-white/90">Properties Available</p>
          </motion.div>

          {/* Account Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                Status
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Active</h3>
            <p className="text-sm text-white/90">Account Status</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Your Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {userContext?.userAuthData?.email || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {userContext?.userAuthData?.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Profession */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Profession</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {userContext?.userAuthData?.profession || 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Age */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Age</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {userContext?.userAuthData?.age || 'N/A'} years
                  </p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {userContext?.userAuthData?.bio && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-2">About Me</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {userContext.userAuthData.bio}
                </p>
              </div>
            )}

            {/* Edit Profile Button */}
            <button
              onClick={() => router.push(`/updateProfile?id=${userContext?.userAuthData?._id}`)}
              className="mt-6 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Edit Profile
            </button>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push("/")}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border border-green-200 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Browse Properties</p>
                  <p className="text-xs text-gray-600">Find your perfect home</p>
                </div>
              </button>

              <button
                onClick={() => router.push("/wishlist")}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 rounded-xl border border-pink-200 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Saved listings</p>
                  <p className="text-xs text-gray-600">Homes you&apos;ve saved</p>
                </div>
              </button>

              <button
                onClick={() => router.push(`/updateProfile?id=${userContext?.userAuthData?._id}`)}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl border border-blue-200 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Update Profile</p>
                  <p className="text-xs text-gray-600">Edit your information</p>
                </div>
              </button>
            </div>

            {/* Profile Completion Progress */}
            <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">Profile Strength</p>
                <span className="text-lg font-bold text-purple-600">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              {profileCompletion < 100 && (
                <p className="text-xs text-gray-600 mt-2">
                  Complete your profile to get better recommendations
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Upgrade to Owner CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-2xl shadow-2xl p-8 sm:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HomeIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Want to List Your Property?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Upgrade to a property owner account and start earning from your properties. 
              Get access to referral rewards, property management tools, and more!
            </p>
            <a
              href="mailto:support@vrental.in?subject=Upgrade to Property Owner Account"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5" />
              Contact Support to Upgrade
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
