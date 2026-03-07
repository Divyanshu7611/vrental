"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { io, Socket } from "socket.io-client";
import { X, Send, MessageCircle, Loader2 } from "lucide-react";
import { useGlobalSocket, joinConversation, leaveConversation, messagesCache as globalMessagesCache } from "@/hooks/useGlobalSocket";

interface Message {
  id?: string;
  senderID: string;
  receiverID: string;
  message: string;
  messageType: "text" | "image" | "file";
  timestamp: string;
  isRead: boolean;
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationID: string | null;
  ownerData: {
    firstName: string;
    lastName: string;
    image: string;
  };
  apartmentName: string;
}

// Use global messages cache from the hook
const messagesCache = globalMessagesCache;

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  conversationID,
  ownerData,
  apartmentName,
}) => {
  // Initialize with cached messages if available
  const [messages, setMessages] = useState<Message[]>(() => {
    return conversationID && messagesCache[conversationID] ? messagesCache[conversationID] : [];
  });
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesCountRef = useRef<number>(0);
  const userContext = useContext(UserContext);
  const currentUserID = userContext?.userAuthData?._id;
  
  // Initialize global socket connection
  useGlobalSocket(currentUserID);

  // Scroll to bottom when messages change - INSTANTLY
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Auto-scroll when messages change - triggers immediately
  useEffect(() => {
    // Use a small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [messages]);

  // Function to fetch messages from API
  const fetchMessages = async () => {
    if (!conversationID) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/messages/get?conversationID=${conversationID}&limit=50`
      );
      if (response.data.success) {
        console.log("Fetched messages from API:", response.data.data.length);
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to messages when conversation is available
  useEffect(() => {
    if (!isOpen || !conversationID) {
      return;
    }

    let isMounted = true;

    const setupConversation = async () => {
      try {
        // Only show loading if we don't have cached messages
        const hasCachedMessages = conversationID && messagesCache[conversationID] && messagesCache[conversationID].length > 0;
        if (!hasCachedMessages) {
          setIsLoading(true);
        }
        
        console.log("🚀 Setting up conversation:", conversationID);
        
        // Fetch messages from API (MongoDB)
        try {
          const response = await axios.get(
            `/api/messages/get?conversationID=${conversationID}&limit=50`
          );
          if (response.data.success && isMounted) {
            const fetchedMessages = response.data.data;
            console.log("📡 Fetched messages from API (MongoDB):", fetchedMessages.length);
            
            messagesCountRef.current = fetchedMessages.length;
            
            // Update cache
            if (conversationID) {
              messagesCache[conversationID] = fetchedMessages;
            }
            
            setMessages(fetchedMessages);
            setIsLoading(false);
          }
        } catch (apiError) {
          console.error("❌ Error fetching from API:", apiError);
          setIsLoading(false);
        }
        
        // Join conversation room using global socket
        joinConversation(conversationID);
        
        console.log("✅ Conversation setup complete");
      } catch (error) {
        console.error("❌ Error setting up conversation:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    setupConversation();

    return () => {
      console.log("Cleaning up conversation:", conversationID);
      isMounted = false;
      
      // Leave conversation room
      leaveConversation(conversationID);
    };
  }, [isOpen, conversationID]);

  // Listen for new messages from global socket and update UI
  useEffect(() => {
    if (!isOpen || !conversationID) return;

    const handleNewMessage = (newMessage: Message) => {
      // Only process messages for this conversation
      if (newMessage.conversationID !== conversationID) return;
      
      console.log("⚡ Modal: New message for this conversation:", newMessage);
      
      setMessages(prev => {
        // Check if message already exists
        const messageExists = prev.some(msg => 
          (msg.id === newMessage.id) || 
          (msg.message === newMessage.message && msg.timestamp === newMessage.timestamp)
        );
        
        if (messageExists) {
          console.log("⚠️ Message already exists in modal, skipping");
          return prev;
        }
        
        // Add new message
        const updated = [...prev, newMessage];
        messagesCountRef.current = updated.length;
        
        return updated;
      });
      
      // Scroll to bottom
      setTimeout(() => scrollToBottom(), 50);
    };

    // Subscribe to cache updates
    const checkCacheInterval = setInterval(() => {
      if (messagesCache[conversationID] && messagesCache[conversationID].length > messagesCountRef.current) {
        console.log("📦 Cache updated, syncing with modal");
        setMessages([...messagesCache[conversationID]]);
        messagesCountRef.current = messagesCache[conversationID].length;
      }
    }, 500); // Check every 500ms

    return () => {
      clearInterval(checkCacheInterval);
    };
  }, [isOpen, conversationID]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationID || !currentUserID || isSending) {
      return;
    }

    const messageText = newMessage.trim();
    setIsSending(true);
    
    // Create optimistic message
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      senderID: currentUserID,
      receiverID: "", // Will be filled by server
      message: messageText,
      messageType: "text",
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    // Add message optimistically to UI (only for sender)
    setMessages(prev => {
      // Check if message already exists
      const messageExists = prev.some(msg => msg.id === optimisticMessage.id);
      if (messageExists) {
        return prev;
      }
      
      const updated = [...prev, optimisticMessage];
      messagesCountRef.current = updated.length;
      
      // Update cache
      if (conversationID) {
        messagesCache[conversationID] = updated;
      }
      
      return updated;
    });
    setNewMessage("");
    
    // Scroll to bottom immediately
    setTimeout(() => scrollToBottom(), 50);
    
    try {
      const response = await axios.post("/api/messages/send", {
        conversationID,
        senderID: currentUserID,
        message: messageText,
        messageType: "text",
      });

      if (response.data.success) {
        console.log("✅ Message sent successfully:", response.data);
        
        // Replace optimistic message with real message from server
        const realMessage = response.data.data;
        setMessages(prev => {
          // Remove optimistic message and add real message
          const filtered = prev.filter(msg => msg.id !== optimisticMessage.id);
          const updated = [...filtered, {
            id: realMessage._id,
            senderID: realMessage.senderID,
            receiverID: realMessage.receiverID,
            message: realMessage.message,
            messageType: realMessage.messageType,
            timestamp: realMessage.createdAt || new Date().toISOString(),
            isRead: realMessage.isRead,
          }];
          
          messagesCountRef.current = updated.length;
          
          // Update cache
          if (conversationID) {
            messagesCache[conversationID] = updated;
          }
          
          return updated;
        });
        
        // Message sent successfully - Socket.IO will update receiver
        console.log("✅ Message sent - Socket.IO will update receiver instantly");
        
        // Mark messages as read when sending
        try {
          await axios.put("/api/messages/read", {
            conversationID,
            userID: currentUserID,
          });
        } catch (readError) {
          console.error("Error marking messages as read:", readError);
        }
      } else {
        // Remove optimistic message on failure
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== optimisticMessage.id);
          messagesCountRef.current = filtered.length;
          
          // Update cache
          if (conversationID) {
            messagesCache[conversationID] = filtered;
          }
          
          return filtered;
        });
        setNewMessage(messageText); // Restore message text
        
        const errorMsg = response.data.message || response.data.error || "Unknown error";
        console.error("Failed to send message:", response.data);
        alert("Failed to send message: " + errorMsg);
      }
    } catch (error: any) {
      // Remove optimistic message on error
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== optimisticMessage.id);
        messagesCountRef.current = filtered.length;
        
        // Update cache
        if (conversationID) {
          messagesCache[conversationID] = filtered;
        }
        
        return filtered;
      });
      setNewMessage(messageText); // Restore message text
      
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again. " + (error.response?.data?.error || error.message));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Format timestamp helper
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[70vh] max-h-[600px] flex flex-col transform transition-all duration-300 scale-100 border border-gray-100/50 mx-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100/80 bg-gradient-to-r from-[#00F0FF]/8 via-white to-white shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00F0FF]/20 to-[#00D4E6]/20 blur-sm group-hover:blur-md transition-all duration-300"></div>
              <img
                src={`https://api.dicebear.com/5.x/initials/svg?seed=${ownerData.firstName} ${ownerData.lastName}&backgroundColor=418FA9`}
                className="relative w-12 h-12 rounded-full border-2 border-[#00F0FF]/40 shadow-lg ring-2 ring-[#00F0FF]/10"
                alt="Owner"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate leading-tight">
                {ownerData.firstName} {ownerData.lastName}
              </h3>
              <p className="text-xs text-gray-500 truncate mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-gray-100/80 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ml-2 group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gradient-to-b from-gray-50/30 via-white to-white scroll-smooth">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative">
                <div className="absolute inset-0 bg-[#00F0FF]/20 rounded-full blur-xl animate-pulse"></div>
                <Loader2 className="relative w-10 h-10 text-[#00F0FF] animate-spin mb-4" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/30 to-[#00D4E6]/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#00F0FF]/15 to-[#00F0FF]/5 flex items-center justify-center border border-[#00F0FF]/20">
                  <MessageCircle className="w-12 h-12 text-[#00F0FF]" />
                </div>
              </div>
              <p className="text-gray-800 font-semibold text-xl mb-2">No messages yet</p>
              <p className="text-sm text-gray-500 text-center max-w-xs leading-relaxed">
                Start the conversation by sending a message below!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwnMessage = msg.senderID === currentUserID;
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showAvatar = !prevMessage || prevMessage.senderID !== msg.senderID;
              const timeDiff = prevMessage 
                ? (new Date(msg.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) / 1000 / 60
                : 10;
              const showTimeSeparator = !prevMessage || timeDiff > 5;

              return (
                <React.Fragment key={msg.id || msg.timestamp}>
                  {showTimeSeparator && (
                    <div className="flex items-center justify-center my-5">
                      <div className="text-xs text-gray-500 bg-gray-100/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    </div>
                  )}
                  <div
                    className={`flex items-end gap-2.5 ${isOwnMessage ? "justify-end" : "justify-start"} ${
                      showAvatar ? "mt-3" : "mt-1.5"
                    }`}
                  >
                    {!isOwnMessage && (
                      <div className="w-9 h-9 flex-shrink-0">
                        {showAvatar ? (
                          <img
                            src={`https://api.dicebear.com/5.x/initials/svg?seed=${ownerData.firstName} ${ownerData.lastName}&backgroundColor=418FA9`}
                            className="w-9 h-9 rounded-full ring-2 ring-gray-100 shadow-sm"
                            alt="Owner"
                          />
                        ) : (
                          <div className="w-9"></div>
                        )}
                      </div>
                    )}
                    <div
                      className={`max-w-[72%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                        isOwnMessage
                          ? "bg-gradient-to-br from-[#00F0FF] to-[#00D4E6] text-gray-900 rounded-br-sm shadow-[#00F0FF]/20"
                          : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-sm shadow-gray-200/50"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed break-words font-normal">
                        {msg.message}
                      </p>
                      <p className={`text-[10px] mt-2 font-medium ${isOwnMessage ? "text-gray-800/60" : "text-gray-500/80"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {isOwnMessage && (
                      <div className="w-9 h-9 flex-shrink-0">
                        {showAvatar ? (
                          <img
                            src={`https://api.dicebear.com/5.x/initials/svg?seed=${userContext?.userAuthData?.firstName || "User"} ${userContext?.userAuthData?.lastName || ""}&backgroundColor=418FA9`}
                            className="w-9 h-9 rounded-full ring-2 ring-[#00F0FF]/20 shadow-sm"
                            alt="You"
                          />
                        ) : (
                          <div className="w-9"></div>
                        )}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100/80 bg-gradient-to-b from-white to-gray-50/30 rounded-b-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/5 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="relative w-full border-2 border-gray-200/80 rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-[#00F0FF]/40 focus:border-[#00F0FF] transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:shadow-md"
                rows={1}
                disabled={isSending}
                style={{
                  maxHeight: "120px",
                  minHeight: "48px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className="bg-gradient-to-br from-[#00F0FF] to-[#00D4E6] text-gray-900 p-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl hover:shadow-[#00F0FF]/30 disabled:shadow-lg flex-shrink-0 group relative overflow-hidden"
              aria-label="Send message"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isSending ? (
                <Loader2 className="relative w-5 h-5 animate-spin" />
              ) : (
                <Send className="relative w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400/80 mt-2.5 px-1.5 flex items-center gap-1.5">
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;

