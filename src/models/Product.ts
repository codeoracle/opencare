import { Schema, models, model, Types, Model } from "mongoose";

export interface IProduct {
  tenant: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  /** Optional — products without a price show "Price on request". */
  price?: number;
  compareAtPrice?: number;
  images: string[];
  brand?: Types.ObjectId;
  category?: Types.ObjectId;
  specs: { label: string; value: string }[];
  features: string[];
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  isAdvertised: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    images: [{ type: String }],
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    specs: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    features: [{ type: String }],
    stock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isAdvertised: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ tenant: 1, slug: 1 }, { unique: true });
ProductSchema.index({ tenant: 1, isActive: 1, isFeatured: -1, createdAt: -1 });

export const Product: Model<IProduct> =
  (models.Product as Model<IProduct>) || model<IProduct>("Product", ProductSchema);
