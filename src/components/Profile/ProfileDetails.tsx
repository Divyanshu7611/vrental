  "use client";
  import React, { useEffect, useState } from "react";
  import { UserContext } from "@/context/UserContext";
  import { useRouter } from "next/navigation";
  import { useContext } from "react";
  import { Card, CardContent } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { UserCircle, Briefcase, Info, Hash, Calendar, Mail, Phone, Shield, CheckCircle2 } from "lucide-react";

  export default function ProfileDetails() {
    const router = useRouter();
    const userContext = useContext(UserContext);

    useEffect(() => {
      if (!userContext?.userAuthData) {
        router.push("/auth");
      }
    }, [userContext?.userAuthData]);

    return (
      <div className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="w-full overflow-hidden shadow-xl border-0">
            <CardContent className="p-0">
              {/* Header Banner with Gradient */}
              <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              </div>
              
              <div className="px-6 sm:px-8 pb-8 bg-white">
                {/* Profile Image Section */}
                <div className="relative -mt-20 sm:-mt-24 flex justify-center sm:justify-start">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative bg-white rounded-full p-1">
                      <img
                        src={`https://api.dicebear.com/5.x/initials/svg?seed=${userContext?.userAuthData?.firstName} ${userContext?.userAuthData?.lastName}&backgroundColor=418FA9`}
                        alt="Profile Picture"
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl transform transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>

                {/* User Info Section */}
                <div className="mt-6 sm:mt-8 space-y-6">
                  {/* Name and ID */}
                  <div className="text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                      {userContext?.userAuthData?.firstName}{" "}
                      {userContext?.userAuthData?.lastName}
                    </h1>
                    <Badge variant="secondary" className="mt-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border-blue-200">
                      <Hash className="w-3.5 h-3.5 mr-1.5" />
                      ID: {userContext?.userAuthData?.clientID}
                    </Badge>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow duration-300">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Age</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {userContext?.userAuthData?.age || 'N/A'} years
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 hover:shadow-md transition-shadow duration-300">
                      <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Profession</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {userContext?.userAuthData?.profession || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-300">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userContext?.userAuthData?.email || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow duration-300">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {userContext?.userAuthData?.phone || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-900">Verified Account</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Your account has been verified and is active</p>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-5 sm:p-6 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Info className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">About</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed pl-12">
                      {userContext?.userAuthData?.bio || "No bio provided. Add a bio to tell others about yourself."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }