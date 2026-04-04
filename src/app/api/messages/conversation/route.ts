import Conversation from "@/models/Conversation";
import Apartment from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import admin, { getFirestore } from "@/utilis/firebaseAdmin";

export const dynamic = "force-dynamic";

// Helper function to generate conversation ID
function generateConversationID(userID: string, ownerID: string, apartmentID: string): string {
  // Sort IDs to ensure consistent conversation ID regardless of who initiates
  const sortedIDs = [userID, ownerID, apartmentID].sort();
  return `conv_${sortedIDs.join("_")}`;
}

// Create or get existing conversation
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { userID, apartmentID } = await req.json();

    if (!userID || !apartmentID) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID and Apartment ID are required",
        },
        { status: 400 }
      );
    }

    // Get apartment to find owner
    const apartment = await Apartment.findById(apartmentID).populate("ownerID");
    if (!apartment) {
      return NextResponse.json(
        {
          success: false,
          message: "Apartment not found",
        },
        { status: 404 }
      );
    }

    const ownerID = apartment.ownerID._id.toString();

    // Check if user is trying to message themselves
    if (userID === ownerID) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot create conversation with yourself",
        },
        { status: 400 }
      );
    }

    // Generate conversation ID
    const conversationID = generateConversationID(userID, ownerID, apartmentID);

    // Check if conversation already exists
    let conversation = await Conversation.findOne({ conversationID });

    if (!conversation) {
      // Create new conversation in MongoDB
      conversation = await Conversation.create({
        userID,
        ownerID,
        apartmentID,
        conversationID,
        unreadCountUser: 0,
        unreadCountOwner: 0,
      });

      // Create conversation structure in Firestore
      try {
        const db = getFirestore();
        const conversationData = {
          userID,
          ownerID,
          apartmentID,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        console.log("Creating conversation in Firestore:", conversationID, conversationData);
        await db.collection("conversations").doc(conversationID).set(conversationData);
        
        // Verify it was created
        const verifyDoc = await db.collection("conversations").doc(conversationID).get();
        if (!verifyDoc.exists) {
          throw new Error("Conversation document was not created in Firestore");
        }
        console.log("Conversation created and verified in Firestore");
      } catch (firestoreError: any) {
        console.error("========== FIRESTORE CONVERSATION ERROR ==========");
        console.error("Error creating Firestore conversation:", firestoreError);
        console.error("Error message:", firestoreError.message);
        console.error("Error code:", firestoreError.code);
        console.error("===================================================");
        // Continue even if Firestore fails - MongoDB conversation is already created
      }
    }

    // Populate user and owner details
    await conversation.populate([
      { path: "userID", select: "firstName lastName image email phone" },
      { path: "ownerID", select: "firstName lastName image email phone" },
      { path: "apartmentID", select: "apartmentName location image_urls" },
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Conversation retrieved/created successfully",
        data: conversation,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating/getting conversation:", error);
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

// Get all conversations for a user (both as user and as owner)
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const url = new URL(req.url);
    const userID = url.searchParams.get("userID");
    const role = url.searchParams.get("role"); // "user" or "owner"

    if (!userID) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    let conversations;
    if (role === "owner") {
      // Get conversations where user is the owner
      conversations = await Conversation.find({ ownerID: userID })
        .populate("userID", "firstName lastName image email phone")
        .populate("apartmentID", "apartmentName location image_urls")
        .sort({ lastMessageTime: -1 });
    } else {
      // Get conversations where user is the renter
      conversations = await Conversation.find({ userID: userID })
        .populate("ownerID", "firstName lastName image email phone")
        .populate("apartmentID", "apartmentName location image_urls")
        .sort({ lastMessageTime: -1 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Conversations fetched successfully",
        data: conversations,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching conversations:", error);
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

