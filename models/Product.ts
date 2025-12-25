import mongoose, { Schema, Document, Model } from "mongoose";
import type { Locale } from "./Category";

export interface IProductSpecifications {
  packaging: string;
  shelfLife: string;
  storage: string;
  origin: string;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  locale: Locale;
  name: string;
  description: string;
  category: string; // Category slug reference
  weight: string; // From CSV: Weight column
  minOrder: string; // From CSV: Minimum Order column
  grade: string; // From CSV: Grade column
  image: string;
  gallery: string[];
  featured: boolean;
  new: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
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
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
    },
    weight: {
      type: String,
      default: "",
    },
    minOrder: {
      type: String,
      default: "",
    },
    grade: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    new: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique slug per locale
ProductSchema.index({ slug: 1, locale: 1 }, { unique: true });

// Index for querying by locale
ProductSchema.index({ locale: 1 });

// Index for category filtering
ProductSchema.index({ category: 1, locale: 1 });

// Index for featured products
ProductSchema.index({ featured: 1, locale: 1 });

// Index for new products
ProductSchema.index({ new: 1, locale: 1 });

// Check if model already exists to prevent recompilation in development
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
