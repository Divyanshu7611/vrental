import Conversation from "@/models/Conversation";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import { getFirestore } from "@/utilis/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const url = new URL(req.url);
    const conversationID = url.searchParams.get("conversationID");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    if (!conversationID) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation ID is required",
        },
        { status: 400 }
      );
    }

    // Verify conversation exists
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

    // Get messages from Firestore
    let messages: any[] = [];
    try {
      const db = getFirestore();
      console.log("Fetching messages from Firestore for conversation:", conversationID);
      
      const conversationRef = db.collection("conversations").doc(conversationID);
      const conversationDoc = await conversationRef.get();
      
      if (!conversationDoc.exists) {
        console.log("Conversation document does not exist in Firestore");
        return NextResponse.json(
          {
            success: true,
            message: "No messages found - conversation not initialized in Firestore",
            data: [],
          },
          { status: 200 }
        );
      }

      const messagesRef = conversationRef
        .collection("messages")
        .orderBy("timestamp", "desc")
        .limit(limit);

      const snapshot = await messagesRef.get();
      console.log(`Found ${snapshot.size} messages in Firestore`);

      snapshot.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate?.()?.toISOString();
        messages.push({
          id: doc.id,
          senderID: data.senderID,
          receiverID: data.receiverID,
          message: data.message,
          messageType: data.messageType || "text",
          timestamp: timestamp || new Date().toISOString(),
          isRead: data.isRead || false,
        });
      });

      // Reverse to get chronological order (oldest first)
      messages.reverse();
      console.log(`Returning ${messages.length} messages`);
    } catch (firestoreError: any) {
      console.error("========== FIRESTORE READ ERROR ==========");
      console.error("Error fetching messages from Firestore:", firestoreError);
      console.error("Error message:", firestoreError.message);
      console.error("Error code:", firestoreError.code);
      console.error("==========================================");
      // Return empty array if Firestore fails
      messages = [];
    }

    return NextResponse.json(
      {
        success: true,
        message: "Messages fetched successfully",
        data: messages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching messages:", error);
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

