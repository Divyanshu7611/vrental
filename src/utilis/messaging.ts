import { db } from "./firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

export interface Message {
  id?: string;
  senderID: string;
  receiverID: string;
  message: string;
  messageType: "text" | "image" | "file";
  timestamp: string | Date | Timestamp;
  isRead: boolean;
}

/**
 * Subscribe to messages in a conversation
 * @param conversationID - The conversation ID
 * @param callback - Callback function that receives messages array
 * @returns Unsubscribe function
 */
export function subscribeToMessages(
  conversationID: string,
  callback: (messages: Message[]) => void
): () => void {
  try {
    console.log("🔵 Setting up Firestore subscription for conversation:", conversationID);
    const messagesRef = collection(db, "conversations", conversationID, "messages");
    const messagesQuery = query(
      messagesRef,
      orderBy("timestamp", "asc"),
      limit(100) // Increased limit to get more messages
    );

    console.log("🔵 Firestore query created, setting up onSnapshot listener...");

    // Use onSnapshot for INSTANT real-time updates
    // This will trigger immediately when any message is added/modified/deleted
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const changes = snapshot.docChanges();
        console.log("🟢 Firestore snapshot received! Total docs:", snapshot.size, "Changes:", changes.length);
        
        const messages: Message[] = [];
        
        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          const message = {
            id: doc.id,
            senderID: data.senderID,
            receiverID: data.receiverID,
            message: data.message,
            messageType: data.messageType || "text",
            timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp || new Date().toISOString(),
            isRead: data.isRead || false,
          };
          messages.push(message);
        });
        
        // Log changes for debugging
        changes.forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            console.log("➕ NEW MESSAGE ADDED INSTANTLY:", {
              id: change.doc.id,
              message: data.message,
              senderID: data.senderID,
              timestamp: data.timestamp?.toDate?.()?.toISOString()
            });
          } else if (change.type === "modified") {
            console.log("✏️ Message modified:", change.doc.id);
          } else if (change.type === "removed") {
            console.log("➖ Message removed:", change.doc.id);
          }
        });
        
        console.log("🟢 Total messages after update:", messages.length);
        if (messages.length > 0) {
          console.log("🟢 Latest message:", messages[messages.length - 1]);
        }
        
        // Always call callback immediately with all messages
        // This ensures instant UI updates
        callback(messages);
      },
      (error) => {
        console.error("❌ Error in Firestore subscription:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error details:", error);
        
        // Check for permission errors
        if (error.code === "permission-denied") {
          console.error("⚠️ Permission denied - check Firestore security rules");
          console.error("⚠️ Make sure Firestore rules allow read access to conversations/{conversationID}/messages");
        }
        
        // Call callback with empty array on error to prevent UI freeze
        callback([]);
      }
    );

    console.log("✅ Firestore subscription established successfully");
    return unsubscribe;
  } catch (error: any) {
    console.error("❌ Error setting up Firestore subscription:", error);
    console.error("Error stack:", error.stack);
    // Return a no-op unsubscribe function
    return () => {
      console.log("No-op unsubscribe called");
    };
  }
}

/**
 * Send a message to Firestore
 * Note: This should typically be done through the API route for security
 * This is a client-side helper for direct Firebase operations if needed
 */
export async function sendMessageToFirebase(
  conversationID: string,
  senderID: string,
  receiverID: string,
  message: string,
  messageType: "text" | "image" | "file" = "text"
): Promise<string | null> {
  try {
    const messagesRef = collection(db, "conversations", conversationID, "messages");

    const messageData: Omit<Message, "id"> = {
      senderID,
      receiverID,
      message,
      messageType,
      timestamp: Timestamp.now(),
      isRead: false,
    };

    const docRef = await addDoc(messagesRef, messageData);
    return docRef.id;
  } catch (error) {
    console.error("Error sending message to Firebase:", error);
    return null;
  }
}

/**
 * Mark messages as read in Firestore
 */
export async function markMessagesAsRead(
  conversationID: string,
  messageIDs: string[]
): Promise<boolean> {
  try {
    const batch = messageIDs.map((messageID) => {
      const messageRef = doc(db, "conversations", conversationID, "messages", messageID);
      return updateDoc(messageRef, { isRead: true });
    });

    await Promise.all(batch);
    return true;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return false;
  }
}

/**
 * Subscribe to a single conversation's metadata
 */
export function subscribeToConversation(
  conversationID: string,
  callback: (conversation: any) => void
): () => void {
  const conversationRef = doc(db, "conversations", conversationID);

  const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback({
        ...data,
        createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt,
      });
    }
  });

  return unsubscribe;
}

