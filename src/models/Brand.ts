import { Schema, models, model, Model, Types } from "mongoose";

export interface IBrand {
  tenant: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BrandSchema.index({ tenant: 1, slug: 1 }, { unique: true });

export const Brand: Model<IBrand> =
  (models.Brand as Model<IBrand>) || model<IBrand>("Brand", BrandSchema);
