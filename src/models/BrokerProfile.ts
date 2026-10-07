import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBrokerProfile extends Document {
  userId: Types.ObjectId;
  fullName: string;
  profilePhoto: string;
  mobile: number;
  email: string;
  firmName: string;
  officeAddress: string;
  areasServed: string;
  reraNumber: string;
  reraCertificateUrl: string;
  brokerageDetails: string;
  experience: string;
  otherDetails?: string;
  profileComplete: boolean;
  isActive: boolean;
  planExpiry?: Date;
  planDuration?: number;
  paymentStatus: "Pending" | "Verified";
  txnID?: string;
  paymentDate?: Date;
  paymentAmount?: number;
  monthlyListingsUsed: number;
  monthlyListingResetMonth: string;
}

const brokerProfileSchema = new Schema<IBrokerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, trim: true, default: "" },
    profilePhoto: { type: String, trim: true, default: "" },
    mobile: { type: Number },
    email: { type: String, trim: true, uppercase: true, default: "" },
    firmName: { type: String, trim: true, default: "" },
    officeAddress: { type: String, trim: true, default: "" },
    areasServed: { type: String, trim: true, default: "" },
    reraNumber: { type: String, trim: true, default: "" },
    reraCertificateUrl: { type: String, trim: true, default: "" },
    brokerageDetails: { type: String, trim: true, default: "" },
    experience: { type: String, trim: true, default: "" },
    otherDetails: { type: String, trim: true, default: "" },
    profileComplete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    planExpiry: { type: Date },
    planDuration: { type: Number },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Verified"],
      default: "Pending",
    },
    txnID: { type: String, trim: true, uppercase: true },
    paymentDate: { type: Date },
    paymentAmount: { type: Number },
    monthlyListingsUsed: { type: Number, default: 0, min: 0 },
    monthlyListingResetMonth: { type: String, default: "" },
  },
  { timestamps: true }
);

const BrokerProfile: Model<IBrokerProfile> =
  mongoose.models.BrokerProfile ||
  mongoose.model<IBrokerProfile>("BrokerProfile", brokerProfileSchema);

export default BrokerProfile;
