import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IApartment } from "./Apartment";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  adharNo: number;
  password: string;
  image: string;
  phone: number;
  clientID?: string;
  role: "ADMIN" | "USER";
  participated: IApartment["_id"][];
  resetToken?: string;
  resetTokenExpires?: Date;
  apartments: IApartment["_id"][];
  profession: string;
  age: number;
  bio: string;
  token?: string;
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
    required: true,
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
    required: true,
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
    enum: ["ADMIN", "USER"],
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
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
