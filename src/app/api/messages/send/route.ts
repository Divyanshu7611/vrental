import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import admin, { getFirestore } from "@/utilis/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { conversationID, senderID, message, messageType = "text" } = await req.json();

    if (!conversationID || !senderID || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation ID, Sender ID, and Message are required",
        },
        { status: 400 }
      );
    }

    // Get conversation to find receiver
    const conversation = await Conversation.findOne({ conversationID });
    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation not found",
        },
        { status: 404 }
      );
    }

    // Determine receiver ID
    const receiverID =
      conversation.userID.toString() === senderID
        ? conversation.ownerID.toString()
        : conversation.userID.toString();

    // Create message in Firestore
    let firebaseMessageID: string | null = null;
    let firestoreError: any = null;
    
    try {
      const db = getFirestore();
      console.log("Attempting to write to Firestore for conversation:", conversationID);
      
      // Ensure conversation document exists first
      const conversationRef = db.collection("conversations").doc(conversationID);
      const conversationDoc = await conversationRef.get();
      
      if (!conversationDoc.exists) {
        // Create conversation document if it doesn't exist
        const conversationData = {
          userID: conversation.userID.toString(),
          ownerID: conversation.ownerID.toString(),
          apartmentID: conversation.apartmentID.toString(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        console.log("Creating conversation document with data:", conversationData);
        await conversationRef.set(conversationData);
        console.log("Created conversation document in Firestore:", conversationID);
      } else {
        console.log("Conversation document already exists in Firestore");
      }

      const messagesRef = conversationRef.collection("messages");

      const firebaseMessage = {
        senderID,
        receiverID,
        message,
        messageType,
        timestamp: admin.firestore.FieldValue.serverTimestamp(), // This ensures instant real-time sync
        isRead: false,
      };

      console.log("📤 Adding message to Firestore for INSTANT real-time delivery:", firebaseMessage);
      const messageDoc = await messagesRef.add(firebaseMessage);
      firebaseMessageID = messageDoc.id;
      console.log("✅ Message sent to Firestore successfully. Message ID:", firebaseMessageID);
      console.log("⚡ Real-time listeners will receive this message INSTANTLY");
      
      // Verify the message was actually written
      const verifyDoc = await messageDoc.get();
      if (!verifyDoc.exists) {
        throw new Error("Message was not written to Firestore - verification failed");
      }
      console.log("Verified message exists in Firestore");
      
    } catch (error: any) {
      firestoreError = error;
      console.error("========== FIRESTORE ERROR ==========");
      console.error("Error sending message to Firestore:", error);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Error stack:", error.stack);
      console.error("Conversation ID:", conversationID);
      console.error("=====================================");
      // Don't continue - we need Firestore to work
      // Throw error to fail the request
    }
    
    // If Firestore write failed, return error
    if (firestoreError) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to write message to Firestore",
          error: firestoreError.message,
          code: firestoreError.code,
        },
        { status: 500 }
      );
    }

    // Store message metadata in MongoDB
    const mongoMessage = await Message.create({
      conversationID,
      senderID,
      receiverID,
      message,
      messageType,
      firebaseMessageID,
      isRead: false,
    });

    // Update conversation last message and timestamp
    conversation.lastMessage = message;
    conversation.lastMessageTime = new Date();

    // Update unread counts
    if (conversation.userID.toString() === senderID) {
      conversation.unreadCountOwner += 1;
    } else {
      conversation.unreadCountUser += 1;
    }

    await conversation.save();

    // Emit Socket.IO event for real-time delivery
    try {
      if (global.io) {
        const messageData = {
          id: mongoMessage._id.toString(),
          conversationID, // Include conversationID for cache updates
          senderID,
          receiverID,
          message,
          messageType,
          timestamp: mongoMessage.createdAt || new Date().toISOString(),
          isRead: false,
        };
        
        // Emit to conversation room
        global.io.to(conversationID).emit("new-message", messageData);
        console.log("📤 Socket.IO: Emitted new message to conversation:", conversationID);
        console.log("📤 Socket.IO: Message data:", messageData);
        
        // Also emit globally for users not in the room yet
        global.io.emit("new-message", messageData);
      } else {
        console.warn("⚠️ Socket.IO not available - message saved but not broadcast");
      }
    } catch (socketError) {
      console.error("❌ Error emitting Socket.IO event:", socketError);
      // Don't fail the request if Socket.IO fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        data: {
          ...mongoMessage.toObject(),
          firebaseMessageID,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending message:", error);
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

