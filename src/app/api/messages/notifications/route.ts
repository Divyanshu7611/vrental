import Conversation from "@/models/Conversation";
import User from "@/models/User";
import Apartment from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";

// Ensure models are registered
const ensureModelsLoaded = () => {
  // This forces the models to be loaded and registered with Mongoose
  return { User, Apartment, Conversation };
};

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    ensureModelsLoaded(); // Ensure models are loaded before populate
    const url = new URL(req.url);
    const userID = url.searchParams.get("userID");

    if (!userID) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Get conversations where user has unread messages
    // As a user (renter)
    const userConversations = await Conversation.find({ 
      userID,
      unreadCountUser: { $gt: 0 }
    })
      .populate("ownerID", "firstName lastName image")
      .populate("apartmentID", "apartmentName image_urls")
      .sort({ lastMessageTime: -1 })
      .limit(10)
      .lean();

    // As an owner
    const ownerConversations = await Conversation.find({ 
      ownerID: userID,
      unreadCountOwner: { $gt: 0 }
    })
      .populate("userID", "firstName lastName image")
      .populate("apartmentID", "apartmentName image_urls")
      .sort({ lastMessageTime: -1 })
      .limit(10)
      .lean();

    // Combine and format notifications
    const notifications: any[] = [];

    // Format user conversations (messages from owners)
    userConversations.forEach((conv: any) => {
      notifications.push({
        _id: conv._id,
        conversationID: conv.conversationID,
        sender: {
          _id: conv.ownerID._id,
          firstName: conv.ownerID.firstName,
          lastName: conv.ownerID.lastName,
          image: conv.ownerID.image,
        },
        apartment: {
          _id: conv.apartmentID._id,
          apartmentName: conv.apartmentID.apartmentName,
          image: conv.apartmentID.image_urls?.[0] || "",
        },
        lastMessage: conv.lastMessage || "",
        lastMessageTime: conv.lastMessageTime,
        unreadCount: conv.unreadCountUser,
        type: "message",
      });
    });

    // Format owner conversations (messages from renters)
    ownerConversations.forEach((conv: any) => {
      notifications.push({
        _id: conv._id,
        conversationID: conv.conversationID,
        sender: {
          _id: conv.userID._id,
          firstName: conv.userID.firstName,
          lastName: conv.userID.lastName,
          image: conv.userID.image,
        },
        apartment: {
          _id: conv.apartmentID._id,
          apartmentName: conv.apartmentID.apartmentName,
          image: conv.apartmentID.image_urls?.[0] || "",
        },
        lastMessage: conv.lastMessage || "",
        lastMessageTime: conv.lastMessageTime,
        unreadCount: conv.unreadCountOwner,
        type: "message",
      });
    });

    // Sort by last message time (most recent first)
    notifications.sort((a, b) => {
      const timeA = new Date(a.lastMessageTime).getTime();
      const timeB = new Date(b.lastMessageTime).getTime();
      return timeB - timeA;
    });

    // Calculate total unread count
    const totalUnread = notifications.reduce((sum, notif) => sum + notif.unreadCount, 0);

    return NextResponse.json(
      {
        success: true,
        data: {
          notifications: notifications.slice(0, 10), // Limit to 10 most recent
          totalUnread,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


