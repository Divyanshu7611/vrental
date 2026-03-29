"use client";
import React, { useState } from "react";
import { X, Check, Crown, Zap, Star } from "lucide-react";
import axios from "axios";

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartmentID: string;
  apartmentName: string;
  userID: string;
}

const MEMBERSHIP_PLANS = [
  {
    id: "1month_room",
    name: "Room/PG/Hostel - 1 Month",
    duration: 1,
    price: 99,
    originalPrice: 198,
    category: "ROOM",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    features: [
      "1 Month Visibility",
      "Basic Support",
      "Standard Listing",
      "Email Notifications",
    ],
    popular: false,
  },
  {
    id: "3months_room",
    name: "Room/PG/Hostel - 3 Months",
    duration: 3,
    price: 199,
    originalPrice: 398,
    savings: "Save 50%",
    category: "ROOM",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    features: [
      "3 Months Visibility",
      "Priority Support",
      "Featured Listing",
      "Email Notifications",
    ],
    popular: false,
  },
  {
    id: "6months_room",
    name: "Room/PG/Hostel - 6 Months",
    duration: 6,
    price: 299,
    originalPrice: 598,
    savings: "Save 50%",
    category: "ROOM",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    features: [
      "6 Months Visibility",
      "Priority Support",
      "Featured Listing",
      "Email & SMS Notifications",
      "Analytics Dashboard",
    ],
    popular: true,
  },
  {
    id: "1month_flat",
    name: "Flat/Apartment - 1 Month",
    duration: 1,
    price: 199,
    originalPrice: 398,
    category: "FLAT",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    features: [
      "1 Month Visibility",
      "Basic Support",
      "Standard Listing",
      "Email Notifications",
    ],
    popular: false,
  },
  {
    id: "3months_flat",
    name: "Flat/Apartment - 3 Months",
    duration: 3,
    price: 399,
    originalPrice: 798,
    savings: "Save 50%",
    category: "FLAT",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    features: [
      "3 Months Visibility",
      "Priority Support",
      "Featured Listing",
      "Email Notifications",
    ],
    popular: false,
  },
  {
    id: "6months_flat",
    name: "Flat/Apartment - 6 Months",
    duration: 6,
    price: 599,
    originalPrice: 1198,
    savings: "Save 50%",
    category: "FLAT",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    features: [
      "6 Months Visibility",
      "Priority Support",
      "Featured Listing",
      "Email & SMS Notifications",
      "Analytics Dashboard",
    ],
    popular: true,
  },
  {
    id: "1month_commercial",
    name: "Commercial - 1 Month",
    duration: 1,
    price: 299,
    originalPrice: 598,
    category: "SHOP",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    features: [
      "1 Month Visibility",
      "Basic Support",
      "Standard Listing",
      "Email Notifications",
    ],
    popular: false,
  },
  {
    id: "3months_commercial",
    name: "Commercial - 3 Months",
    duration: 3,
    price: 699,
    originalPrice: 1398,
    savings: "Save 50%",
    category: "SHOP",
    icon: Star,
    color: "from-amber-500 to-orange-500",
    features: [
      "3 Months Visibility",
      "Priority Support",
      "Featured Listing",
      "Email Notifications",
    ],
    popular: false,
  },
  {
    id: "6months_commercial",
    name: "Commercial - 6 Months",
    duration: 6,
    price: 999,
    originalPrice: 1998,
    savings: "Save 50%",
    category: "SHOP",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    features: [
      "6 Months Visibility",
      "24/7 Premium Support",
      "Top Featured Listing",
      "All Notifications",
      "Advanced Analytics",
      "Priority Placement",
    ],
    popular: true,
  },
];

const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  apartmentID,
  apartmentName,
  userID,
}) => {
  const [selectedPlan, setSelectedPlan] = useState(MEMBERSHIP_PLANS[1].id);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    const plan = MEMBERSHIP_PLANS.find((p) => p.id === selectedPlan);
    if (!plan) return;

    setIsProcessing(true);

    try {
      // Create Razorpay order
      const orderResponse = await axios.post("/api/payment/create-order", {
        amount: plan.price,
        apartmentID,
        userID,
        duration: plan.duration,
      });

      if (!orderResponse.data.success) {
        throw new Error("Failed to create order");
      }

      const { orderId, amount, currency } = orderResponse.data.data;

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "VRental",
        description: `${plan.name} Plan - ${plan.duration} Month${plan.duration > 1 ? "s" : ""}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await axios.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              apartmentID,
              userID,
              duration: plan.duration,
              amount: plan.price,
            });

            if (verifyResponse.data.success) {
              alert("Payment successful! Your apartment is now live.");
              onClose();
              window.location.reload();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#00F0FF",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const selectedPlanData = MEMBERSHIP_PLANS.find((p) => p.id === selectedPlan);

  return (
    <>
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#00F0FF]/10 to-purple-500/10 p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Crown className="w-8 h-8 text-amber-500" />
                Choose Your Membership Plan
              </h2>
              <p className="text-gray-600 mt-1">
                Unlock visibility for: <span className="font-semibold">{apartmentName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Plans */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              {MEMBERSHIP_PLANS.map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? "border-[#00F0FF] shadow-xl shadow-[#00F0FF]/20"
                        : "border-gray-200 hover:border-gray-300"
                    } ${plan.popular ? "ring-4 ring-purple-500/20" : ""}`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                        <span className="text-gray-500 line-through">₹{plan.originalPrice}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        for {plan.duration} month{plan.duration > 1 ? "s" : ""}
                      </p>
                      {plan.savings && (
                        <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {plan.savings}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Select Button */}
                    <button
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-[#00F0FF] to-[#00D4E6] text-gray-900 shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select Plan"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Payment Button */}
            <div className="mt-8 bg-gradient-to-r from-[#00F0FF]/10 to-purple-500/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected Plan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedPlanData?.name} - ₹{selectedPlanData?.price}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedPlanData?.duration} month{selectedPlanData && selectedPlanData.duration > 1 ? "s" : ""} visibility
                  </p>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-[#00F0FF] to-[#00D4E6] text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
                >
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>🔒 Secure payment powered by Razorpay</p>
              <p className="mt-1">Your apartment will be visible immediately after payment confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipModal;
