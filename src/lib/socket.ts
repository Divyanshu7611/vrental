import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

let io: SocketIOServer | null = null;

export const initSocket = (server: NetServer) => {
  if (!io) {
    io = new SocketIOServer(server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);

      // Join conversation room
      socket.on("join-conversation", (conversationID: string) => {
        socket.join(conversationID);
        console.log(`👤 User ${socket.id} joined conversation: ${conversationID}`);
      });

      // Leave conversation room
      socket.on("leave-conversation", (conversationID: string) => {
        socket.leave(conversationID);
        console.log(`👋 User ${socket.id} left conversation: ${conversationID}`);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });

    console.log("🚀 Socket.IO server initialized");
  }

  return io;
};

export const getIO = (): SocketIOServer | null => {
  return io;
};

export const emitNewMessage = (conversationID: string, message: any) => {
  if (io) {
    io.to(conversationID).emit("new-message", message);
    console.log(`📤 Emitted new message to conversation: ${conversationID}`);
  }
};
