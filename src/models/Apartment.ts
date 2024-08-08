import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User";

export interface IApartment extends Document {
  apartmentName: string;
  description: string;
  price: number;
  facility: string; // This will store comma-separated facilities
  location: string;
  image_urls: string[]; // Image URLs
  category: string;
  availableFor: string;
  contactNo: number;
  ownerID: Types.ObjectId; // Owner ID of the user
  participants: Types.ObjectId[];
}

const apartmentSchema: Schema = new Schema<IApartment>({
  apartmentName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  facility: {
    type: String, // This will store comma-separated facilities
    required: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  location: {
    type: String,
    required: true,
    trim: true,
  },
  image_urls: [
    {
      type: String, // Image URLs as strings
      required: true,
    },
  ],
  category: {
    type: String,
    required: true,
  },
  availableFor: {
    type: String,
    required: true,
  },
  contactNo: {
    type: Number,
    required: true,
  },
  ownerID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Apartment: Model<IApartment> =
  mongoose.models.Apartment ||
  mongoose.model<IApartment>("Apartment", apartmentSchema);

export default Apartment;
