"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
  Gift,
  TrendingUp,
  Users,
  Wallet,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
  Share2,
  Home,
} from "lucide-react";
import {
  MIN_REFERRAL_WITHDRAWAL_POINTS,
  POINTS_PER_APARTMENT_LISTING_REFERRAL,
} from "@/lib/referralConstants";

interface ReferralStats {
  referralCode: string;
  referralPoints: number;
  referralEarnings: number;
  totalReferrals: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  canWithdraw: boolean;
  referralHistory: Array<{
    referredUserName: string;
    pointsEarned: number;
    date: string;
    source?: "SIGNUP" | "APARTMENT_LISTING";
    apartmentName?: string;
    apartmentId?: string;
  }>;
  withdrawalHistory: Array<{
    amount: number;
    pointsDeducted: number;
    status: string;
    requestDate: string;
    completedDate?: string;
    transactionId?: string;
  }>;
  isOwner: boolean;
  role?: string;
}

type ReferralDashboardProps = {
  /** When true, used inside profile tabs (no full-page loading layout). */
  embedded?: boolean;
};

export default function ReferralDashboard({ embedded = false }: ReferralDashboardProps) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "BANK">("UPI");
  const [upiId, setUpiId] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    bankName: "",
  });

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/referral/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching referral stats:", error);
      toast.error("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(stats.referralCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralCode = async () => {
    if (stats?.referralCode) {
      const shareText = shareBlurb;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: "VRENTAL Referral",
            text: shareText,
          });
        } catch (error) {
          console.log("Share cancelled");
        }
      } else {
        copyReferralCode();
      }
    }
  };

  const openPaymentModal = () => {
    const points = parseInt(withdrawAmount);

    if (!points || points < MIN_REFERRAL_WITHDRAWAL_POINTS) {
      toast.error(
        `Minimum withdrawal is ${MIN_REFERRAL_WITHDRAWAL_POINTS} points (₹${MIN_REFERRAL_WITHDRAWAL_POINTS})`
      );
      return;
    }

    if (points > (stats?.referralPoints || 0)) {
      toast.error("Insufficient points");
      return;
    }

    setShowPaymentModal(true);
  };

  const handleWithdraw = async () => {
    const points = parseInt(withdrawAmount);

    // Validate payment details
    if (paymentMethod === "UPI" && !upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }

    if (paymentMethod === "BANK") {
      if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
        toast.error("Please fill all bank details");
        return;
      }
    }

    setWithdrawing(true);

    try {
      const token = localStorage.getItem("token");
      const payload: any = {
        points,
        paymentMethod,
      };

      if (paymentMethod === "UPI") {
        payload.upiId = upiId;
      } else {
        payload.bankDetails = bankDetails;
      }

      const response = await axios.post(
        "/api/referral/withdraw",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setWithdrawAmount("");
        setUpiId("");
        setBankDetails({
          accountNumber: "",
          ifscCode: "",
          accountHolderName: "",
          bankName: "",
        });
        setShowPaymentModal(false);
        fetchReferralStats();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Withdrawal failed");
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center ${embedded ? "min-h-[240px]" : "min-h-screen"}`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`max-w-4xl mx-auto ${embedded ? "py-4" : "p-6"}`}>
        <p className="text-center text-gray-600">Could not load referral data. Please try again later.</p>
      </div>
    );
  }

  const role = stats.role || (stats.isOwner ? "OWNER" : "USER");
  if (role === "ADMIN") {
    return (
      <div className={`max-w-4xl mx-auto ${embedded ? "py-4" : "p-6"}`}>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <Gift className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Referrals</h3>
          <p className="text-gray-600">Referral rewards are not available for admin accounts.</p>
        </div>
      </div>
    );
  }

  const isOwner = role === "OWNER";
  const shareBlurb = isOwner
    ? `List on VRENTAL with my referral code ${stats.referralCode} — I earn rewards when you publish a property!`
    : `Use my VRENTAL referral code ${stats.referralCode} when a property owner lists their apartment — we both support the community and I earn reward points!`;

  return (
    <div className={`max-w-7xl mx-auto ${embedded ? "px-0 py-2 sm:py-4" : "p-4 sm:p-6 lg:p-8"}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Referral Dashboard
        </h1>
        <p className="text-gray-600">
          {isOwner
            ? "Share your code with other owners — you earn points when they list a property using it."
            : "Share your code with property owners — you earn points when they register a listing with your code."}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8" />
            <span className="text-sm opacity-90">Available</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.referralPoints}</h3>
          <p className="text-sm opacity-90">Points (₹{stats.referralPoints})</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-sm opacity-90">Total Earned</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">₹{stats.referralEarnings}</h3>
          <p className="text-sm opacity-90">Lifetime Earnings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <span className="text-sm opacity-90">Referrals</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalReferrals}</h3>
          <p className="text-sm opacity-90">Successful Referrals</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <IndianRupee className="w-8 h-8" />
            <span className="text-sm opacity-90">Withdrawn</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">₹{stats.totalWithdrawn}</h3>
          <p className="text-sm opacity-90">Total Withdrawn</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Your Referral Code</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-3">Share this code with others:</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white rounded-lg px-4 py-3 font-mono text-2xl font-bold text-blue-600 border-2 border-blue-200">
                {stats.referralCode}
              </div>
              <button
                onClick={copyReferralCode}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </button>
              <button
                onClick={shareReferralCode}
                className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">How it works:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  {isOwner
                    ? "Share your code with other owners listing on VRENTAL."
                    : "Share your code with friends who list properties as owners."}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  Referral reward points are earned <strong className="text-gray-800">only</strong> when an
                  owner successfully publishes an apartment listing and enters your code on the listing
                  form ({POINTS_PER_APARTMENT_LISTING_REFERRAL} points, ₹{POINTS_PER_APARTMENT_LISTING_REFERRAL}
                  ). <strong className="text-gray-800">No points</strong> are awarded for registering a new
                  user account alone.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  Listers cannot use their own referral code on a listing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>
                  Withdraw from {MIN_REFERRAL_WITHDRAWAL_POINTS} points (₹{MIN_REFERRAL_WITHDRAWAL_POINTS})
                  upward.
                </span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Withdrawal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Withdraw</h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (Points)
            </label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder={`Min. ${MIN_REFERRAL_WITHDRAWAL_POINTS} points`}
              min={MIN_REFERRAL_WITHDRAWAL_POINTS}
              max={stats.referralPoints}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              1 Point = ₹1 | Available: {stats.referralPoints} points
            </p>
          </div>

          <button
            onClick={openPaymentModal}
            disabled={
              !stats.canWithdraw ||
              withdrawing ||
              stats.pendingWithdrawals > 0 ||
              !withdrawAmount ||
              parseInt(withdrawAmount) < MIN_REFERRAL_WITHDRAWAL_POINTS
            }
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            Continue to Payment Details
          </button>

          {!stats.canWithdraw && (
            <p className="text-xs text-orange-600 mt-3 text-center">
              Minimum {MIN_REFERRAL_WITHDRAWAL_POINTS} points required to withdraw
            </p>
          )}

          {stats.pendingWithdrawals > 0 && (
            <p className="text-xs text-blue-600 mt-3 text-center">
              You have a pending withdrawal request
            </p>
          )}
        </motion.div>
      </div>

      {/* Referral History */}
      {stats.referralHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Referral History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    From (owner who acted)
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Property
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Points
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.referralHistory.map((ref, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{ref.referredUserName}</td>
                    <td className="py-3 px-4 text-sm">
                      {ref.source === "APARTMENT_LISTING" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-cyan-800">
                          <Home className="h-3.5 w-3.5" />
                          Listing
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-violet-800">
                          Sign-up
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {ref.apartmentName ? (
                        <span className="font-medium">{ref.apartmentName}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      +{ref.pointsEarned} pts
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(ref.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Withdrawal History */}
      {stats.withdrawalHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Withdrawal History</h2>
          <div className="space-y-4">
            {stats.withdrawalHistory.map((withdrawal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      withdrawal.status === "COMPLETED"
                        ? "bg-green-100"
                        : withdrawal.status === "PENDING"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                    }`}
                  >
                    {withdrawal.status === "COMPLETED" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : withdrawal.status === "PENDING" ? (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">₹{withdrawal.amount}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(withdrawal.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    withdrawal.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : withdrawal.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {withdrawal.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Payment Details Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Payment Details</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Withdrawal Amount</p>
                <p className="text-2xl font-bold text-blue-600">₹{withdrawAmount}</p>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === "UPI"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <Wallet className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <p className="font-semibold text-gray-800">UPI</p>
                      <p className="text-xs text-gray-500">Instant Transfer</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("BANK")}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === "BANK"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <IndianRupee className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="font-semibold text-gray-800">Bank</p>
                      <p className="text-xs text-gray-500">IMPS/NEFT</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* UPI Form */}
              {paymentMethod === "UPI" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@paytm"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your UPI ID (e.g., 9876543210@paytm)
                    </p>
                  </div>
                </div>
              )}

              {/* Bank Form */}
              {paymentMethod === "BANK" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountHolderName}
                      onChange={(e) =>
                        setBankDetails({ ...bankDetails, accountHolderName: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) =>
                        setBankDetails({ ...bankDetails, accountNumber: e.target.value })
                      }
                      placeholder="1234567890"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={bankDetails.ifscCode}
                      onChange={(e) =>
                        setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })
                      }
                      placeholder="SBIN0001234"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={bankDetails.bankName}
                      onChange={(e) =>
                        setBankDetails({ ...bankDetails, bankName: e.target.value })
                      }
                      placeholder="State Bank of India"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {withdrawing ? "Processing..." : "Submit Request"}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your withdrawal will be processed within 3-5 business days
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
