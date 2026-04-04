"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { Bell, MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import MessageModal from "@/components/messaging/MessageModal";

interface Notification {
  _id: string;
  conversationID: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  apartment: {
    _id: string;
    apartmentName: string;
    image: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  type: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const userContext = useContext(UserContext);
  const router = useRouter();
  const userID = userContext?.userAuthData?._id;

  useEffect(() => {
    if (userID) {
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userID]);

  const fetchNotifications = async () => {
    if (!userID) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/messages/notifications?userID=${userID}`);
      if (response.data.success) {
        setNotifications(response.data.data.notifications || []);
        setTotalUnread(response.data.data.totalUnread || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setCurrentNotification(notification);
    setSelectedConversation(notification.conversationID);
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConversation(null);
    setCurrentNotification(null);
    // Refresh notifications after closing modal
    fetchNotifications();
  };

  if (!userID) return null;

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {totalUnread > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#00F0FF]/10 to-transparent">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#00F0FF]" />
                    Notifications
                    {totalUnread > 0 && (
                      <span className="bg-[#00F0FF] text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {totalUnread}
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[400px]">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F0FF] mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No new messages</p>
                    <p className="text-gray-400 text-xs mt-1">You&apos;re all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={notification.sender.image}
                            alt={`${notification.sender.firstName} ${notification.sender.lastName}`}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 truncate">
                                  {notification.sender.firstName} {notification.sender.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {notification.apartment.apartmentName}
                                </p>
                              </div>
                              {notification.unreadCount > 0 && (
                                <span className="bg-[#00F0FF] text-white text-xs font-bold rounded-full px-2 py-0.5 flex-shrink-0">
                                  {notification.unreadCount}
                                </span>
                              )}
                            </div>
                            {notification.lastMessage && (
                              <p className="text-sm text-gray-600 truncate mb-1">
                                {notification.lastMessage}
                              </p>
                            )}
                            {notification.lastMessageTime && (
                              <p className="text-xs text-gray-400">
                                {new Date(notification.lastMessageTime).toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full text-sm text-[#00F0FF] font-medium hover:text-[#00D4E6] transition-colors"
                  >
                    View all messages
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isModalOpen && currentNotification && (
        <MessageModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          conversationID={currentNotification.conversationID}
          ownerData={{
            firstName: currentNotification.sender.firstName,
            lastName: currentNotification.sender.lastName,
            image: currentNotification.sender.image,
          }}
          apartmentName={currentNotification.apartment.apartmentName}
        />
      )}
    </>
  );
}


