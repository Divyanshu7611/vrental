"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Global socket instance
let globalSocket: Socket | null = null;

// Message cache per conversation
export const messagesCache: Record<string, any[]> = {};

export const useGlobalSocket = (userID: string | undefined) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userID) return;

    // Only create one global socket connection
    if (!globalSocket) {
      console.log("🌐 Initializing global Socket.IO connection...");
      
      globalSocket = io({
        path: "/socket.io",
        transports: ['websocket', 'polling'],
      });

      globalSocket.on("connect", () => {
        console.log("✅ Global Socket.IO connected:", globalSocket?.id);
      });

      globalSocket.on("new-message", (newMessage: any) => {
        console.log("⚡ Global: New message received:", newMessage);
        
        const conversationID = newMessage.conversationID || 
          (newMessage.senderID && newMessage.receiverID ? 
            `${newMessage.senderID}-${newMessage.receiverID}` : null);
        
        if (conversationID && messagesCache[conversationID]) {
          // Check if message already exists
          const messageExists = messagesCache[conversationID].some((msg: any) => 
            (msg.id === newMessage.id) || 
            (msg.message === newMessage.message && msg.timestamp === newMessage.timestamp)
          );
          
          if (!messageExists) {
            messagesCache[conversationID] = [...messagesCache[conversationID], newMessage];
            console.log("✅ Global: Message added to cache for conversation:", conversationID);
          }
        }
      });

      globalSocket.on("disconnect", () => {
        console.log("❌ Global Socket.IO disconnected");
      });

      globalSocket.on("connect_error", (error) => {
        console.error("❌ Global Socket.IO connection error:", error);
      });
    }

    socketRef.current = globalSocket;

    return () => {
      // Don't disconnect global socket on unmount
      // It should stay connected for the entire session
    };
  }, [userID]);

  return socketRef.current;
};

export const joinConversation = (conversationID: string) => {
  if (globalSocket && globalSocket.connected) {
    globalSocket.emit("join-conversation", conversationID);
    console.log("👤 Joined conversation:", conversationID);
  }
};

export const leaveConversation = (conversationID: string) => {
  if (globalSocket && globalSocket.connected) {
    globalSocket.emit("leave-conversation", conversationID);
    console.log("👋 Left conversation:", conversationID);
  }
};

export const disconnectGlobalSocket = () => {
  if (globalSocket) {
    globalSocket.disconnect();
    globalSocket = null;
    console.log("🔌 Global Socket.IO disconnected");
  }
};
