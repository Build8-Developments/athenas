import mongoose, { Schema, Document, Model } from "mongoose";

export type Locale = "en" | "ar";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  locale: Locale;
  name: string;
  icon: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    locale: {
      type: String,
      required: true,
      enum: ["en", "ar"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique slug per locale
CategorySchema.index({ slug: 1, locale: 1 }, { unique: true });

// Index for querying by locale
CategorySchema.index({ locale: 1 });

// Check if model already exists to prevent recompilation in development
const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
