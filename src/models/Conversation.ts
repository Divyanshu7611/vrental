import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User";
import { IApartment } from "./Apartment";

export interface IConversation extends Document {
  userID: Types.ObjectId; // The user (renter) who initiated the conversation
  ownerID: Types.ObjectId; // The property owner
  apartmentID: Types.ObjectId; // The apartment/property being discussed
  conversationID: string; // Firebase Realtime Database conversation ID
  lastMessage?: string; // Last message preview
  lastMessageTime?: Date; // Timestamp of last message
  unreadCountUser: number; // Unread messages for user
  unreadCountOwner: number; // Unread messages for owner
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema: Schema = new Schema<IConversation>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    apartmentID: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    conversationID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    unreadCountUser: {
      type: Number,
      default: 0,
    },
    unreadCountOwner: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
conversationSchema.index({ userID: 1, apartmentID: 1 });
conversationSchema.index({ ownerID: 1, apartmentID: 1 });
conversationSchema.index({ conversationID: 1 });

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversation;





