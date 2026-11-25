import { Schema, models, model, Model, Types } from "mongoose";

export interface ICategory {
  tenant: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.index({ tenant: 1, slug: 1 }, { unique: true });

export const Category: Model<ICategory> =
  (models.Category as Model<ICategory>) || model<ICategory>("Category", CategorySchema);
