import mongoose, { Schema, Document, Model, ObjectId, Types } from "mongoose";
import { ICategory } from "./Category";

export interface IApartment extends Document {
  apartmentName: string;
  image_urls: string[];
  public_ids: string[];
  description: string;
  price: number;
  furniture: boolean;
  furnitureDescription: string;
  facility: string;
  parking: boolean;
  electricity: boolean;
  location: string;
  client: Types.ObjectId[];
  category: Types.ObjectId;
}

const apartmentSchema: Schema = new Schema<IApartment>({
  apartmentName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  image_urls: [
    {
      type: String,
      required: true,
    },
  ],
  public_ids: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  furnitureDescription: {
    type: String,
    required: true,
    trim: true,
  },
  facility: { type: String, required: true },
  client: [{ type: Schema.Types.ObjectId, ref: "User" }],
  furniture: { type: Boolean, required: true },
  parking: { type: Boolean, required: true },
  electricity: { type: Boolean, required: true },
  category: { type: Schema.Types.ObjectId, required: true },
});

const Apartment: Model<IApartment> =
  mongoose.models.Apartment ||
  mongoose.model<IApartment>("Apartment", apartmentSchema);

export default Apartment;
