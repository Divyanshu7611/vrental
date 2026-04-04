"use client";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  Users,
  Home,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Mail,
  Eye,
  Ban,
  CheckCheck,
  Wallet,
} from "lucide-react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  referralPoints: number;
  referralEarnings: number;
  withdrawalRequests?: any[];
  createdAt: string;
}

interface Apartment {
  _id: string;
  apartmentName: string;
  ownerID: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  category: string;
  price: number;
  location: string;
  memberShipExpiry: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

interface WithdrawalRequest {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  amount: number;
  points: number;
  status: string;
  paymentMethod?: string;
  upiId?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName?: string;
  };
  requestedAt: string;
  processedAt?: string;
}

interface Stats {
  totalUsers: number;
  totalOwners: number;
  totalRenters: number;
  totalApartments: number;
  activeApartments: number;
  expiredApartments: number;
  expiringIn7Days: number;
  pendingWithdrawals: number;
  totalWithdrawalAmount: number;
  newApartmentsToday: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "apartments" | "users" | "withdrawals">("overview");
  
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOwners: 0,
    totalRenters: 0,
    totalApartments: 0,
    activeApartments: 0,
    expiredApartments: 0,
    expiringIn7Days: 0,
    pendingWithdrawals: 0,
    totalWithdrawalAmount: 0,
    newApartmentsToday: 0,
  });

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [expiringApartments, setExpiringApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    if (userContext?.userAuthData?.role !== "ADMIN") {
      toast.error("Access denied. Admin only.");
      router.push("/");
      return;
    }

    fetchAdminData();
  }, [userContext, router]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [statsRes, apartmentsRes, usersRes, withdrawalsRes, expiringRes] = await Promise.all([
        axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/apartments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/withdrawals", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/apartments/expiring", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (apartmentsRes.data.success) setApartments(apartmentsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (withdrawalsRes.data.success) {
        console.log("Withdrawals data:", withdrawalsRes.data.data);
        setWithdrawals(withdrawalsRes.data.data);
      }
      if (expiringRes.data.success) setExpiringApartments(expiringRes.data.data);
    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      toast.error(error.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/admin/withdrawals/${action}`,
        { withdrawalId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Withdrawal ${action}d successfully`);
        fetchAdminData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} withdrawal`);
    }
  };

  const sendExpiryReminder = async (apartmentId: string, ownerEmail: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/admin/send-reminder",
        { apartmentId, ownerEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Reminder sent successfully");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reminder");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your VRental platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalOwners} Owners • {stats.totalRenters} Renters
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Apartments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalApartments}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.newApartmentsToday} today
                </p>
              </div>
              <Home className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.expiringIn7Days}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.expiredApartments} expired
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Withdrawals</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.pendingWithdrawals}</p>
                <p className="text-xs text-gray-500 mt-1">
                  ₹{stats.totalWithdrawalAmount.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("apartments")}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === "apartments"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Apartments ({apartments.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === "users"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("withdrawals")}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === "withdrawals"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Withdrawals ({withdrawals.length})
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Apartments Expiring Soon (Next 7 Days)
                  </h3>
                  {expiringApartments.length === 0 ? (
                    <p className="text-gray-500 text-sm">No apartments expiring soon</p>
                  ) : (
                    <div className="space-y-3">
                      {expiringApartments.map((apt) => (
                        <div
                          key={apt._id}
                          className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{apt.apartmentName}</h4>
                            {apt.ownerID ? (
                              <>
                                <p className="text-sm text-gray-600">
                                  Owner: {apt.ownerID.firstName} {apt.ownerID.lastName} ({apt.ownerID.email})
                                </p>
                                <p className="text-sm text-orange-600 font-medium mt-1">
                                  Expires: {new Date(apt.memberShipExpiry).toLocaleDateString()}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-gray-500 italic">Owner information not available</p>
                            )}
                          </div>
                          {apt.ownerID && (
                            <button
                              onClick={() => sendExpiryReminder(apt._id, apt.ownerID.email)}
                              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                              <Mail className="w-4 h-4" />
                              Send Reminder
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Recent Withdrawal Requests
                  </h3>
                  {withdrawals.filter(w => w.status === "PENDING").length === 0 ? (
                    <p className="text-gray-500 text-sm">No pending withdrawal requests</p>
                  ) : (
                    <div className="space-y-3">
                      {withdrawals
                        .filter(w => w.status === "PENDING")
                        .slice(0, 5)
                        .map((withdrawal) => (
                          <div
                            key={withdrawal._id}
                            className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {withdrawal.userId.firstName} {withdrawal.userId.lastName}
                              </h4>
                              <p className="text-sm text-gray-600">{withdrawal.userId.email}</p>
                              <p className="text-sm text-purple-600 font-medium mt-1">
                                Amount: ₹{withdrawal.amount} ({withdrawal.points} points)
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleWithdrawalAction(withdrawal._id, "approve")}
                                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleWithdrawalAction(withdrawal._id, "reject")}
                                className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Apartments Tab */}
            {activeTab === "apartments" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Apartment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {apartments.map((apt) => {
                      const isExpired = new Date(apt.memberShipExpiry) < new Date();
                      const isExpiringSoon =
                        new Date(apt.memberShipExpiry) <
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                      return (
                        <tr key={apt._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {apt.apartmentName}
                            </div>
                            <div className="text-sm text-gray-500">{apt.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {apt.ownerID ? (
                              <>
                                <div className="text-sm text-gray-900">
                                  {apt.ownerID.firstName} {apt.ownerID.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{apt.ownerID.email}</div>
                              </>
                            ) : (
                              <div className="text-sm text-gray-500 italic">Owner not found</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {apt.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{apt.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(apt.memberShipExpiry).toLocaleDateString()}
                            </div>
                            {isExpired && (
                              <span className="text-xs text-red-600 font-medium">Expired</span>
                            )}
                            {!isExpired && isExpiringSoon && (
                              <span className="text-xs text-orange-600 font-medium">
                                Expiring Soon
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                apt.status === "Available For Rent"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referral Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Earnings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "OWNER"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "ADMIN"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.phoneNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.referralPoints || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{((user.referralEarnings || 0) * 10).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Withdrawals Tab */}
            {activeTab === "withdrawals" && (
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => (
                  <div
                    key={withdrawal._id}
                    className={`p-6 rounded-xl border-2 ${
                      withdrawal.status === "PENDING"
                        ? "bg-yellow-50 border-yellow-200"
                        : withdrawal.status === "APPROVED"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {withdrawal.userId.firstName} {withdrawal.userId.lastName}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              withdrawal.status === "PENDING"
                                ? "bg-yellow-200 text-yellow-800"
                                : withdrawal.status === "APPROVED"
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {withdrawal.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-sm font-medium text-gray-900">
                              {withdrawal.userId.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="text-sm font-medium text-gray-900">
                              {withdrawal.userId.phoneNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Amount</p>
                            <p className="text-lg font-bold text-purple-600">
                              ₹{withdrawal.amount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Points</p>
                            <p className="text-sm font-medium text-gray-900">
                              {withdrawal.points} points
                            </p>
                          </div>
                        </div>

                        {/* Payment Details Section */}
                        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                          <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-blue-600" />
                            Payment Details {withdrawal.paymentMethod && `(${withdrawal.paymentMethod})`}
                          </h5>
                          
                          {!withdrawal.upiId && !withdrawal.bankDetails && (
                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                              <p className="text-sm text-red-600 font-medium">
                                ⚠️ No payment details provided by user. Please contact user to get payment details.
                              </p>
                            </div>
                          )}
                          
                          {withdrawal.upiId && (
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">UPI ID</p>
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-blue-600">{withdrawal.upiId}</p>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(withdrawal.upiId || "");
                                    toast.success("UPI ID copied!");
                                  }}
                                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                >
                                  Copy
                                </button>
                              </div>
                            </div>
                          )}

                          {withdrawal.bankDetails && (
                            <div className="space-y-2">
                              <div className="bg-white p-3 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Account Holder Name</p>
                                <p className="text-base font-bold text-gray-900">
                                  {withdrawal.bankDetails.accountHolderName}
                                </p>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Account Number</p>
                                <div className="flex items-center justify-between">
                                  <p className="text-base font-bold text-gray-900">
                                    {withdrawal.bankDetails.accountNumber}
                                  </p>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(withdrawal.bankDetails?.accountNumber || "");
                                      toast.success("Account number copied!");
                                    }}
                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                  >
                                    Copy
                                  </button>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">IFSC Code</p>
                                <div className="flex items-center justify-between">
                                  <p className="text-base font-bold text-gray-900">
                                    {withdrawal.bankDetails.ifscCode}
                                  </p>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(withdrawal.bankDetails?.ifscCode || "");
                                      toast.success("IFSC code copied!");
                                    }}
                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                  >
                                    Copy
                                  </button>
                                </div>
                              </div>
                              {withdrawal.bankDetails.bankName && (
                                <div className="bg-white p-3 rounded-lg">
                                  <p className="text-xs text-gray-600 mb-1">Bank Name</p>
                                  <p className="text-base font-medium text-gray-900">
                                    {withdrawal.bankDetails.bankName}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-gray-500">
                          Requested: {new Date(withdrawal.requestedAt).toLocaleString()}
                        </p>
                      </div>

                      {withdrawal.status === "PENDING" && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleWithdrawalAction(withdrawal._id, "approve")}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleWithdrawalAction(withdrawal._id, "reject")}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {withdrawals.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No withdrawal requests found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
