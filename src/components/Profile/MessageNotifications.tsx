"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { MessageCircle, Bell, X } from "lucide-react";
import MessageModal from "@/components/messaging/MessageModal";

interface Conversation {
  _id: string;
  userID: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  apartmentID: {
    _id: string;
    apartmentName: string;
    image_urls?: string[];
  };
  conversationID: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCountOwner: number;
}

export default function MessageNotifications() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const userContext = useContext(UserContext);
  const ownerID = userContext?.userAuthData?._id;

  useEffect(() => {
    if (ownerID) {
      fetchConversations();
      // Refresh conversations every 30 seconds for real-time updates
      const interval = setInterval(fetchConversations, 30000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [ownerID]);

  const fetchConversations = async () => {
    if (!ownerID) return;
    
    try {
      setLoading(true);
      const userRole = userContext?.userAuthData?.role;
      const isOwner = userRole && (userRole.toUpperCase() === "OWNER" || userRole === "OWNER");
      
      // Fetch conversations based on user role
      const role = isOwner ? "owner" : "user";
      const response = await axios.get(
        `/api/messages/conversation?userID=${ownerID}&role=${role}`
      );
      
      if (response.data.success) {
        setConversations(response.data.data || []);
      }
    } catch (error: any) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const userRole = userContext?.userAuthData?.role;
  const isOwner = userRole && (userRole.toUpperCase() === "OWNER" || userRole === "OWNER");
  const totalUnread = conversations.reduce((sum, conv) => 
    sum + (isOwner ? conv.unreadCountOwner : conv.unreadCountUser), 0
  );

  const handleOpenConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setSelectedConversation(conversation.conversationID);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConversation(null);
    setCurrentConversation(null);
    // Refresh conversations to update unread counts
    fetchConversations();
  };

  // Show for all users now

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#00F0FF] to-[#00D4E6] rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Message Notifications</h3>
              <p className="text-sm text-gray-500">Messages about your properties</p>
            </div>
          </div>
          {totalUnread > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold rounded-full px-2.5 py-1 min-w-[24px] text-center">
              {totalUnread}
            </div>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">No messages yet</p>
            <p className="text-gray-400 text-xs mt-1">
              {isOwner 
                ? "You'll see messages from renters here when they contact you about your properties"
                : "You'll see messages from property owners here when you contact them"
              }
            </p>
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-left text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>Owner ID: {ownerID || "Not found"}</p>
                <p>Role: {userRole || "Not set"}</p>
                <p>Is Owner: {isOwner ? "Yes" : "No"}</p>
                <p>Loading: {loading ? "Yes" : "No"}</p>
                <p>Conversations found: {conversations.length}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => handleOpenConversation(conversation)}
                className="p-4 border border-gray-200 rounded-lg hover:border-[#00F0FF] hover:shadow-md transition-all duration-200 cursor-pointer bg-gray-50/50 hover:bg-white"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={isOwner 
                      ? conversation.userID?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${conversation.userID?.firstName} ${conversation.userID?.lastName}&backgroundColor=418FA9`
                      : conversation.ownerID?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${conversation.ownerID?.firstName} ${conversation.ownerID?.lastName}&backgroundColor=418FA9`
                    }
                    alt={isOwner 
                      ? `${conversation.userID?.firstName} ${conversation.userID?.lastName}`
                      : `${conversation.ownerID?.firstName} ${conversation.ownerID?.lastName}`
                    }
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {isOwner 
                          ? `${conversation.userID?.firstName || ""} ${conversation.userID?.lastName || ""}`.trim()
                          : `${conversation.ownerID?.firstName || ""} ${conversation.ownerID?.lastName || ""}`.trim()
                        }
                      </h4>
                      {(isOwner ? conversation.unreadCountOwner : conversation.unreadCountUser) > 0 && (
                        <span className="bg-[#00F0FF] text-white text-xs font-bold rounded-full px-2 py-0.5 ml-2 flex-shrink-0">
                          {isOwner ? conversation.unreadCountOwner : conversation.unreadCountUser}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {conversation.apartmentID?.apartmentName || "Property"}
                    </p>
                    {conversation.lastMessage && (
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                    )}
                    {conversation.lastMessageTime && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conversation.lastMessageTime).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && currentConversation && (
        <MessageModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          conversationID={currentConversation.conversationID}
          ownerData={{
            firstName: isOwner 
              ? currentConversation.userID?.firstName || ""
              : currentConversation.ownerID?.firstName || "",
            lastName: isOwner 
              ? currentConversation.userID?.lastName || ""
              : currentConversation.ownerID?.lastName || "",
            image: isOwner 
              ? currentConversation.userID?.image || ""
              : currentConversation.ownerID?.image || "",
          }}
          apartmentName={currentConversation.apartmentID?.apartmentName || "Property"}
        />
      )}
    </>
  );
}

