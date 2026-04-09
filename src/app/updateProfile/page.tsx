"use client";
import React, { useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import type { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Loader2 } from "lucide-react";
import { UserContext } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500";

export default function UpdateProfile() {
  const userContext = useContext(UserContext);

  const [phoneInput, setPhoneInput] = useState("");
  const [profession, setProfession] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [bio, setBio] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdFromQuery = searchParams.get("id");
  const [token, setToken] = useState<string | null>(null);

  const effectiveUserId =
    userContext?.userAuthData?._id ?? userIdFromQuery ?? null;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  useEffect(() => {
    if (userContext?.userAuthData) {
      const u = userContext.userAuthData;
      setPhoneInput(u.phone ? String(u.phone) : "");
      setProfession(u.profession || "");
      setAgeInput(u.age ? String(u.age) : "");
      setBio(u.bio || "");
      setFirstName(u.firstName || "");
      setLastName(u.lastName || "");
    }
  }, [userContext]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!effectiveUserId) {
      toast.error("Could not determine your account. Please sign in again.");
      router.push("/auth");
      return;
    }

    const digits = phoneInput.replace(/\D/g, "");
    if (digits.length !== 10) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }
    const ageNum = parseInt(ageInput, 10);
    if (!Number.isFinite(ageNum) || ageNum < 1 || ageNum > 120) {
      toast.error("Enter a valid age.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.put(
        `/api/auth/updateProfile?id=${effectiveUserId}`,
        {
          phone: Number(digits),
          profession,
          age: ageNum,
          bio,
          firstName,
          lastName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.User) {
        toast.success("Profile updated successfully.");
        const next = response.data.User as Record<string, unknown>;
        const prev = userContext?.userAuthData;
        const { password: _p, ...rest } = next as {
          password?: string;
          [k: string]: unknown;
        };
        userContext?.AuthDataHandler({
          ...(prev ?? ({} as NonNullable<typeof prev>)),
          ...rest,
          _id: String(rest._id ?? effectiveUserId),
          wishlist: prev?.wishlist ?? {},
        });
        router.push("/profile");
      } else {
        toast.error(
          (response.data as { error?: string }).error ||
            "Failed to update profile"
        );
      }
    } catch (error) {
      const err = error as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-lg">
        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to profile
        </button>

        <Card className="overflow-hidden border-0 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <div
            className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500"
            aria-hidden
          />
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl text-slate-900">
              Edit profile
            </CardTitle>
            <CardDescription className="text-slate-600">
              Update your details. They may appear as uppercase when saved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Name
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className={inputClass}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClass}>
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className={inputClass}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Contact
                </p>
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone (10 digits)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className={inputClass}
                    value={phoneInput}
                    onChange={(e) =>
                      setPhoneInput(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    required
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  About you
                </p>
                <div>
                  <label htmlFor="profession" className={labelClass}>
                    Profession
                  </label>
                  <input
                    id="profession"
                    type="text"
                    className={inputClass}
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    required
                    autoComplete="organization-title"
                  />
                </div>
                <div>
                  <label htmlFor="age" className={labelClass}>
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    min={1}
                    max={120}
                    className={inputClass}
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bio" className={labelClass}>
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    className={`${inputClass} min-h-[100px] resize-y`}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
}
