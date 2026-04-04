import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IApartment } from "./Apartment";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  adharNo?: number;
  password: string;
  image: string;
  phone: number;
  clientID?: string;
  role: "ADMIN" | "USER" | "OWNER";
  participated: IApartment["_id"][];
  resetToken?: string;
  resetTokenExpires?: Date;
  apartments: IApartment["_id"][];
  profession: string;
  age: number;
  bio: string;
  token?: string;
  termsAndConditions: boolean;
  // Referral System
  referralCode: string; // Unique referral code (same as _id)
  referredBy?: string; // ID of the user who referred this user
  referralPoints: number; // Points earned from referrals
  referralEarnings: number; // Total earnings in rupees (1 point = 1 rupee)
  referralHistory: Array<{
    referredUserId: Types.ObjectId;
    referredUserName: string;
    pointsEarned: number;
    date: Date;
  }>;
  withdrawalHistory: Array<{
    amount: number;
    pointsDeducted: number;
    status: "PENDING" | "COMPLETED" | "REJECTED";
    requestDate: Date;
    completedDate?: Date;
    transactionId?: string;
    paymentMethod?: "UPI" | "BANK";
    upiId?: string;
    bankDetails?: {
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
      bankName?: string;
    };
    razorpayPayoutId?: string;
    razorpayFundAccountId?: string;
  }>;
}

const userSchema: Schema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  lastName: {
    type: String,
    trim: true,
    uppercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  adharNo: {
    type: Number,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 10,
  },
  clientID: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  participated: [
    {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
    },
  ],
  apartments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
    },
  ],
  role: {
    type: String,
    enum: ["ADMIN", "USER", "OWNER"],
    default: "USER",
    required: true,
    trim: true,
    uppercase: true,
  },
  resetToken: {
    type: String,
    default: undefined,
  },
  resetTokenExpires: {
    type: Date,
    default: undefined,
  },
  profession: {
    type: String,
    trim: true,
    uppercase: true,
    default: "",
  },

  age: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    trim: true,
    default: "",
  },
  termsAndConditions: {
    type: Boolean,
    trim: true,
    default: false,
  },
  // Referral System Fields
  referralCode: {
    type: String,
    required: false, // Not required - will be auto-generated
    unique: true,
    sparse: true, // Allow null values but enforce uniqueness when present
    trim: true,
    uppercase: true,
  },
  referredBy: {
    type: String,
    trim: true,
    uppercase: true,
    default: null,
  },
  referralPoints: {
    type: Number,
    default: 0,
    min: 0,
  },
  referralEarnings: {
    type: Number,
    default: 0,
    min: 0,
  },
  referralHistory: [
    {
      referredUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      referredUserName: {
        type: String,
        trim: true,
      },
      pointsEarned: {
        type: Number,
        default: 0,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  withdrawalHistory: [
    {
      amount: {
        type: Number,
        required: true,
      },
      pointsDeducted: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "REJECTED"],
        default: "PENDING",
      },
      requestDate: {
        type: Date,
        default: Date.now,
      },
      completedDate: {
        type: Date,
      },
      transactionId: {
        type: String,
      },
      paymentMethod: {
        type: String,
        enum: ["UPI", "BANK"],
      },
      upiId: {
        type: String,
        trim: true,
      },
      bankDetails: {
        accountNumber: String,
        ifscCode: String,
        accountHolderName: String,
        bankName: String,
      },
      razorpayPayoutId: {
        type: String,
      },
      razorpayFundAccountId: {
        type: String,
      },
    },
  ],
});

// Pre-save hook to generate referralCode if not set
userSchema.pre("save", function (next) {
  if (!this.referralCode) {
    // Generate a unique 8-character referral code
    const { nanoid } = require("nanoid");
    this.referralCode = nanoid(8).toUpperCase();
  }
  next();
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
