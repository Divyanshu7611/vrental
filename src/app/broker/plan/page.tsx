"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import Spinner from "@/components/global/Spinner";
import { UserContext } from "@/context/UserContext";
import { BROKER_MEMBERSHIP_PLANS } from "@/lib/brokerMembershipPlans";
import { ensureRazorpayCheckoutLoaded, getRazorpayConstructor } from "@/lib/razorpayClient";

export default function BrokerPlanPage() {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [processing, setProcessing] = useState(false);
  const [planActive, setPlanActive] = useState(false);

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
        if (!res.data?.data?.profileComplete) {
          router.push("/broker/onboarding");
          return;
        }
        setPlanActive(Boolean(res.data?.quota?.planActive));
      } catch {
        toast.error("Could not load broker plan status");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [userContext?.userAuthData, router]);

  const handlePayment = async () => {
    const plan = BROKER_MEMBERSHIP_PLANS.find((p) => p.value === selectedPlan);
    if (!plan) {
      toast.error("Select a broker plan");
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const orderRes = await axios.post(
        "/api/broker/plan/create-order",
        { planValue: plan.value },
        { headers: { Authorization: `Bearer ${token}`, "x-auth-token": token ?? "" } }
      );
      if (!orderRes.data.success) throw new Error(orderRes.data.message);

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
      if (!keyId) throw new Error("Razorpay not configured");

      await ensureRazorpayCheckoutLoaded();
      const RazorpayCtor = getRazorpayConstructor();
      if (!RazorpayCtor) throw new Error("Razorpay unavailable");

      const { orderId, amount, currency } = orderRes.data.data;
      const razorpay = new RazorpayCtor({
        key: keyId,
        amount,
        currency,
        name: "VRental",
        description: `Broker Profile Plan - ${plan.name}`,
        order_id: orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await axios.post(
              "/api/broker/plan/verify",
              {
                ...response,
                planValue: plan.value,
                amount: plan.price,
              },
              { headers: { Authorization: `Bearer ${token}`, "x-auth-token": token ?? "" } }
            );
            if (verifyRes.data.success) {
              toast.success("Broker plan activated!");
              router.push("/list-apartment");
            } else {
              toast.error(verifyRes.data.message || "Verification failed");
            }
          } catch {
            toast.error("Payment verification failed");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: `${userContext?.userAuthData?.firstName ?? ""} ${userContext?.userAuthData?.lastName ?? ""}`.trim(),
          email: userContext?.userAuthData?.email || "",
        },
        theme: { color: "#4F46E5" },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      });
      razorpay.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      toast.error(msg);
      setProcessing(false);
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
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Broker Profile Plan</h1>
        <p className="mb-6 text-gray-600">
          Active plan includes verified profile visibility and up to 3 free apartment listings per month.
        </p>

        {planActive && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            Your broker plan is active. You can list up to 3 properties per month at no extra cost.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {BROKER_MEMBERSHIP_PLANS.map((plan) => (
            <button
              key={plan.value}
              type="button"
              onClick={() => setSelectedPlan(plan.value)}
              className={`rounded-2xl border-2 p-6 text-left transition ${
                selectedPlan === plan.value
                  ? "border-indigo-600 bg-indigo-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-indigo-300"
              }`}
            >
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="my-3 text-3xl font-bold text-indigo-600">₹{plan.price}</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePayment}
            disabled={!selectedPlan || processing}
            className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {processing ? "Processing..." : "Purchase Plan"}
          </button>
          {planActive && (
            <button
              type="button"
              onClick={() => router.push("/list-apartment")}
              className="rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              List Property
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
