import mongoose, { Schema, Document, Model } from "mongoose";
import { IApartment } from "./Apartment";

export interface ICategory extends Document {
  category: string;
  houselist: IApartment["_id"][];
}

const CategorySchema: Schema<ICategory> = new Schema<ICategory>({
  category: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  houselist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
    },
  ],
});

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
