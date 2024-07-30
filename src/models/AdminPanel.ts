import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";

export interface IAdminPanel extends Document {
  adminId: IUser["_id"];
  roles: string[];
  approve: boolean;
}

const adminPanelSchema: Schema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  roles: [{ type: String, required: true }],
  approve: { type: Boolean, default: false },
});

const AdminPanel: Model<IAdminPanel> =
  mongoose.models.AdminPanel ||
  mongoose.model<IAdminPanel>("AdminPanel", adminPanelSchema);

export default AdminPanel;
