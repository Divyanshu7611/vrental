  "use client";
  import React, { useEffect, useState } from "react";
  import { UserContext } from "@/context/UserContext";
  import { useRouter } from "next/navigation";
  import { useContext } from "react";
  import { Card, CardContent } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { UserCircle, Briefcase, Info, Hash, Calendar } from "lucide-react";

  export default function ProfileDetails() {
    const router = useRouter();
    const userContext = useContext(UserContext);

    useEffect(() => {
      if (!userContext?.userAuthData) {
        router.push("/auth");
      }
    }, [userContext?.userAuthData]);

    return (
      <div className="min-h-screen min-w-screen py-20 px-4">
        <Card className="w-full max-w-screen-2xl mx-auto overflow-hidden">
          <CardContent className="p-0">
            {/* Header Banner */}
            <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-500" />
            
            <div className="px-6 pb-6">
              {/* Profile Image Section */}
              <div className="relative -mt-16 flex justify-center lg:justify-start">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200" />
                  <img
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${userContext?.userAuthData?.firstName} ${userContext?.userAuthData?.lastName}&backgroundColor=418FA9`}
                    alt="Profile Picture"
                    className="relative w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl transform transition duration-200 hover:scale-105"
                  />
                </div>
              </div>

              {/* User Info Section */}
              <div className="mt-6 space-y-6">
                {/* Name and ID */}
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {userContext?.userAuthData?.firstName}{" "}
                    {userContext?.userAuthData?.lastName}
                  </h1>
                  <Badge variant="secondary" className="mt-2">
                    <Hash className="w-3 h-3 mr-1" />
                    {userContext?.userAuthData?.clientID}
                  </Badge>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-cyan-600" />
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium text-gray-900">
                        {userContext?.userAuthData?.age} years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-cyan-600" />
                    <div>
                      <p className="text-sm text-gray-500">Profession</p>
                      <p className="font-medium text-gray-900">
                        {userContext?.userAuthData?.profession}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-medium text-gray-900">About</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {userContext?.userAuthData?.bio || "No bio provided"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }