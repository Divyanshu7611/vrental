import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import admin, { getFirestore } from "@/utilis/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectMongoDB();
    const { conversationID, userID, messageIDs } = await req.json();

    if (!conversationID || !userID) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation ID and User ID are required",
        },
        { status: 400 }
      );
    }

    // Get conversation
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

    try {
      const db = getFirestore();
      const messagesRef = db
        .collection("conversations")
        .doc(conversationID)
        .collection("messages");

      // If specific message IDs provided, mark only those as read
      if (messageIDs && Array.isArray(messageIDs) && messageIDs.length > 0) {
        const batch = db.batch();
        messageIDs.forEach((messageID: string) => {
          const messageDoc = messagesRef.doc(messageID);
          batch.update(messageDoc, { isRead: true });
        });
        await batch.commit();

        // Update MongoDB messages
        await Message.updateMany(
          {
            conversationID,
            firebaseMessageID: { $in: messageIDs },
            receiverID: userID,
          },
          { isRead: true }
        );
      } else {
        // Mark all unread messages as read for this user
        const snapshot = await messagesRef
          .where("receiverID", "==", userID)
          .where("isRead", "==", false)
          .get();

        const batch = db.batch();
        snapshot.forEach((doc) => {
          batch.update(doc.ref, { isRead: true });
        });

        if (!snapshot.empty) {
          await batch.commit();
        }

        // Update MongoDB messages
        await Message.updateMany(
          {
            conversationID,
            receiverID: userID,
            isRead: false,
          },
          { isRead: true }
        );
      }
    } catch (firestoreError: any) {
      console.error("Error marking messages as read in Firestore:", firestoreError);
      // Continue with MongoDB update even if Firestore fails
      if (messageIDs && Array.isArray(messageIDs) && messageIDs.length > 0) {
        await Message.updateMany(
          {
            conversationID,
            firebaseMessageID: { $in: messageIDs },
            receiverID: userID,
          },
          { isRead: true }
        );
      } else {
        await Message.updateMany(
          {
            conversationID,
            receiverID: userID,
            isRead: false,
          },
          { isRead: true }
        );
      }
    }

    // Reset unread count
    if (conversation.userID.toString() === userID) {
      conversation.unreadCountUser = 0;
    } else if (conversation.ownerID.toString() === userID) {
      conversation.unreadCountOwner = 0;
    }
    await conversation.save();

    return NextResponse.json(
      {
        success: true,
        message: "Messages marked as read",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error marking messages as read:", error);
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

