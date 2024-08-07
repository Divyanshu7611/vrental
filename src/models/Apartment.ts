// import mongoose, { Schema, Document, Model, ObjectId, Types } from "mongoose";
// import { ICategory } from "./Category";
// import { IUser } from "./User";

// export interface IApartment extends Document {
//   apartmentName: string;
//   image_urls: string[];
//   public_ids: string[];
//   description: string;
//   price: number;
//   furniture: boolean;
//   furnitureDescription: string;
//   facility: string;
//   parking: boolean;
//   electricity: boolean;
//   location: string;
//   client: Types.ObjectId[];
//   category: string;
//   availableFor: string;
//   contactNo: number;
//   ownerID: IUser["_id"];
// }

// const apartmentSchema: Schema = new Schema<IApartment>({
//   apartmentName: {
//     type: String,
//     required: true,
//   },
//   location: {
//     type: String,
//     required: true,
//     trim: true,
//     uppercase: true,
//   },
//   image_urls: [
//     {
//       type: String,
//       required: true,
//     },
//   ],
//   public_ids: [
//     {
//       type: String,
//       required: true,
//     },
//   ],
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   contactNo: {
//     type: Number,
//     required: true,
//   },
//   furnitureDescription: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   availableFor: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   facility: { type: String, required: true },
//   client: [{ type: Schema.Types.ObjectId, ref: "User" }],
//   furniture: { type: Boolean, required: true },
//   parking: { type: Boolean, required: true },
//   electricity: { type: Boolean, required: true },
//   category: { type: String, required: true },
//   ownerID: { type: Schema.Types.ObjectId, ref: "User", required: true },
// });

// const Apartment: Model<IApartment> =
//   mongoose.models.Apartment ||
//   mongoose.model<IApartment>("Apartment", apartmentSchema);

// export default Apartment;

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
