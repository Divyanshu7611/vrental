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
} from "lucide-react";

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
}

export default function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

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
      const shareText = `Join VRENTAL using my referral code: ${stats.referralCode} and help me earn rewards!`;
      
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

  const handleWithdraw = async () => {
    const points = parseInt(withdrawAmount);

    if (!points || points < 100) {
      toast.error("Minimum withdrawal is 100 points (₹100)");
      return;
    }

    if (points > (stats?.referralPoints || 0)) {
      toast.error("Insufficient points");
      return;
    }

    setWithdrawing(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/referral/withdraw",
        { points },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setWithdrawAmount("");
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats?.isOwner) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <Gift className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Referral Program for Property Owners Only
          </h3>
          <p className="text-gray-600">
            Upgrade to a property owner account to access the referral program and earn rewards!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
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
          Share your referral code and earn rewards when others register properties!
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
                <span>Share your referral code with property owners</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>When they register a property using your code, you earn 10 points (₹10)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Withdraw your earnings once you reach 100 points (₹100)</span>
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
              placeholder="Min. 100 points"
              min="100"
              max={stats.referralPoints}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              1 Point = ₹1 | Available: {stats.referralPoints} points
            </p>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={
              !stats.canWithdraw ||
              withdrawing ||
              stats.pendingWithdrawals > 0 ||
              !withdrawAmount ||
              parseInt(withdrawAmount) < 100
            }
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {withdrawing ? "Processing..." : "Request Withdrawal"}
          </button>

          {!stats.canWithdraw && (
            <p className="text-xs text-orange-600 mt-3 text-center">
              Minimum 100 points required to withdraw
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
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Points Earned
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
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      +{ref.pointsEarned} points
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
    </div>
  );
}
