"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Gift, CheckCircle, XCircle, Loader } from "lucide-react";

interface ReferralCodeInputProps {
  onSuccess?: () => void;
}

export default function ReferralCodeInput({ onSuccess }: ReferralCodeInputProps) {
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const applyReferralCode = async () => {
    if (!referralCode.trim()) {
      toast.error("Please enter a referral code");
      return;
    }

    setLoading(true);

    try {
      const token =
        typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.post(
        "/api/referral/verify-code",
        { referralCode: referralCode.toUpperCase() },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      if (response.data.success) {
        toast.success(`Referral code verified! Referred by ${response.data.data.referrerName}`);
        setApplied(true);
        
        // Store the verified referral code in localStorage for later use
        localStorage.setItem("pendingReferralCode", referralCode.toUpperCase());
        
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid referral code");
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3"
      >
        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-green-800">Referral Code Applied!</p>
          <p className="text-sm text-green-600">
            The referrer will earn points when you complete registration.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
      <div className="flex items-start gap-3 mb-4">
        <Gift className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1">Have a Referral Code?</h3>
          <p className="text-sm text-gray-600">
            Enter a friend&apos;s or owner&apos;s code. They earn points when you sign up or when you list a
            property using their code (you cannot use your own code).
          </p>
        </div>
      </div>

      <AnimatePresence>
        {!showInput ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInput(true)}
            className="w-full bg-white border-2 border-blue-300 text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Enter Referral Code
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Enter referral code"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono uppercase"
                maxLength={24}
              />
              <button
                onClick={applyReferralCode}
                disabled={loading || !referralCode.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  "Apply"
                )}
              </button>
            </div>
            <button
              onClick={() => setShowInput(false)}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Skip for now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
