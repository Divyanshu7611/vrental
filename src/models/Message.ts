import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User";
import { IConversation } from "./Conversation";

export interface IMessage extends Document {
  conversationID: string; // Firebase conversation ID
  senderID: Types.ObjectId; // MongoDB User ID of sender
  receiverID: Types.ObjectId; // MongoDB User ID of receiver
  message: string;
  messageType: "text" | "image" | "file"; // Type of message
  firebaseMessageID?: string; // Firebase message ID for reference
  isRead: boolean;
  createdAt: Date;
}

const messageSchema: Schema = new Schema<IMessage>(
  {
    conversationID: {
      type: String,
      required: true,
      trim: true,
    },
    senderID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    firebaseMessageID: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
messageSchema.index({ conversationID: 1, createdAt: -1 });
messageSchema.index({ senderID: 1 });
messageSchema.index({ receiverID: 1, isRead: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);

export default Message;





