import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User";

export interface IApartment extends Document {
  apartmentName: string;
  description: string;
  price: number;
  facility: string; // This will store comma-separated facilities
  location: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  image_urls: string[]; // Image URLs
  category: string;
  availableFor: string;
  contactNo: number;
  ownerID: Types.ObjectId; // Owner ID of the user
  participants: Types.ObjectId[];
  ratings: {
    user: Types.ObjectId;
    rating: number;
    comment?: string;
  }[];
  averageRating: number;
  furniture: string;
  status: string;
  paymentStatus: string;
  txnID: string;
  paymentDate: Date;
  paymentAmount?: number;
  memberShipExpiry: Date;
  membershipDuration?: number;
  deactivatedAt?: Date;
  deactivationReason?: string;
  instagramVideoLink?: string;
  youtubeVideoLink?: string;
  /** True when listing was published under an active broker plan (no per-listing fee). */
  listedViaBrokerPlan?: boolean;
}

const apartmentSchema: Schema = new Schema<IApartment>({
  apartmentName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  facility: {
    type: String, // This will store comma-separated facilities
  },
  furniture: {
    type: String, // This will store comma-separated facilities
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
  coordinates: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
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
  status: {
    type: String,
    enum: ["Draft", "Not Available For Rent", "Available For Rent", "Deactivated"],
    default: "Available For Rent",
  },
  deactivatedAt: {
    type: Date,
  },
  deactivationReason: {
    type: String,
  },
  ratings: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Verified"],
    default: "Pending",
  },
  txnID: {
    type: String,
    // required: true,
    trim: true,
    uppercase: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
    
  },
  paymentAmount: {
    type: Number,
  },
  memberShipExpiry: {
    type: Date,
  },
  membershipDuration: {
    type: Number,
  },
  instagramVideoLink: {
    type: String,
    trim: true,
    default: "",
  },
  youtubeVideoLink: {
    type: String,
    trim: true,
    default: "",
  },
  listedViaBrokerPlan: {
    type: Boolean,
    default: false,
  },
});

// Middleware to calculate average rating before saving
apartmentSchema.pre<IApartment>("save", function (next) {
  const apartment = this as IApartment;

  if (apartment.ratings.length > 0) {
    const ratingsSum = apartment.ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    apartment.averageRating = ratingsSum / apartment.ratings.length;
  } else {
    apartment.averageRating = 0;
  }

  next();
});
const Apartment: Model<IApartment> =
  mongoose.models.Apartment ||
  mongoose.model<IApartment>("Apartment", apartmentSchema);

export default Apartment;
