"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import Spinner from "@/components/global/Spinner";
import { UserContext } from "@/context/UserContext";

export default function BrokerOnboardingPage() {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingPhoto, setExistingPhoto] = useState("");
  const [existingCert, setExistingCert] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    firmName: "",
    officeAddress: "",
    areasServed: "",
    reraNumber: "",
    brokerageDetails: "",
    experience: "",
    otherDetails: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [reraCertificate, setReraCertificate] = useState<File | null>(null);

  useEffect(() => {
    if (!userContext?.userAuthData) {
      router.push("/auth");
      return;
    }
    if (userContext.userAuthData.role !== "BROKER") {
      router.push("/profile");
      return;
    }

    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/broker/profile", {
          headers: { Authorization: `Bearer ${token}`, "x-auth-token": token ?? "" },
        });
        const profile = res.data?.data;
        if (profile) {
          setForm({
            fullName: profile.fullName || `${userContext.userAuthData?.firstName ?? ""} ${userContext.userAuthData?.lastName ?? ""}`.trim(),
            mobile: String(profile.mobile || userContext.userAuthData?.phone || ""),
            email: profile.email || userContext.userAuthData?.email || "",
            firmName: profile.firmName || "",
            officeAddress: profile.officeAddress || "",
            areasServed: profile.areasServed || "",
            reraNumber: profile.reraNumber || "",
            brokerageDetails: profile.brokerageDetails || "",
            experience: profile.experience || "",
            otherDetails: profile.otherDetails || "",
          });
          setExistingPhoto(profile.profilePhoto || "");
          setExistingCert(profile.reraCertificateUrl || "");
          if (profile.profileComplete) {
            router.push("/broker/plan");
          }
        } else {
          setForm((prev) => ({
            ...prev,
            fullName: `${userContext.userAuthData?.firstName ?? ""} ${userContext.userAuthData?.lastName ?? ""}`.trim(),
            mobile: String(userContext.userAuthData?.phone || ""),
            email: userContext.userAuthData?.email || "",
          }));
        }
      } catch {
        toast.error("Could not load broker profile");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [userContext?.userAuthData, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (existingPhoto) fd.append("existingProfilePhoto", existingPhoto);
      if (existingCert) fd.append("existingReraCertificate", existingCert);
      if (profilePhoto) fd.append("profilePhoto", profilePhoto);
      if (reraCertificate) fd.append("reraCertificate", reraCertificate);

      const res = await axios.post("/api/broker/profile", fd, {
        headers: { Authorization: `Bearer ${token}`, "x-auth-token": token ?? "" },
      });

      if (res.data.success) {
        toast.success("Broker profile saved");
        router.push("/broker/plan");
      } else {
        toast.error(res.data.message || "Could not save profile");
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : "Save failed";
      toast.error(String(msg || "Save failed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-cyan-50">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Broker Profile Setup</h1>
        <p className="mb-8 text-gray-600">
          Complete your verified broker profile. Gmail OTP verification was done at signup.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-lg">
          {[
            ["fullName", "Full Name *"],
            ["firmName", "Firm / Company Name *"],
            ["officeAddress", "Office Address *"],
            ["areasServed", "Areas / Locations Served *"],
            ["reraNumber", "RERA Registration Number *"],
            ["brokerageDetails", "Brokerage Details / Charges *"],
            ["experience", "Experience *"],
            ["otherDetails", "Other Verification Details"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
              {key === "officeAddress" || key === "brokerageDetails" || key === "otherDetails" ? (
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  rows={3}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={key !== "otherDetails"}
                />
              ) : (
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={key !== "otherDetails"}
                />
              )}
            </div>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mobile *</label>
              <input
                type="tel"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Profile Photo *</label>
            <input type="file" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files?.[0] ?? null)} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">RERA Certificate Upload *</label>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setReraCertificate(e.target.files?.[0] ?? null)} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save & Continue to Plan"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
