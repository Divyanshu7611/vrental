import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";
import { IApartment } from "./Apartment";

export interface IRegistration extends Document {
  captainId: IUser["_id"];
  apartmentID: IApartment["_id"];
  registrationDate: Date;
  users: IUser["email"][];
  payment: boolean;
}

const registrationSchema: Schema = new Schema<IRegistration>({
  apartmentID: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  registrationDate: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
});

const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", registrationSchema);

export default Registration;
