"use client";

import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserContext } from "@/context/UserContext";
import AdminRegisterApartmentForm from "@/components/admin/AdminRegisterApartmentForm";

export default function AdminRegisterApartmentPage() {
  const router = useRouter();
  const userContext = useContext(UserContext);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/auth");
      return;
    }
    if (userContext?.userAuthData?.role !== "ADMIN") {
      toast.error("Access denied. Admin only.");
      router.push("/");
    }
  }, [userContext, router]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-violet-600 hover:text-violet-800 mb-2 inline-block"
            >
              ← Back to dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Register apartment (owner)</h1>
            <p className="text-gray-600 mt-2">
              Create a live listing on behalf of an owner by email, with a membership plan and no payment.
            </p>
          </div>
        </div>

        <AdminRegisterApartmentForm />
      </div>
    </div>
  );
}
