import { Schema, models, model, Types, Model } from "mongoose";

export const LEAD_TYPES = ["enquiry", "distributor", "contact"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export const LEAD_STATUSES = ["new", "contacted", "forwarded", "closed"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/**
 * One collection for every lead the client sites produce, so the agent has a
 * single inbox across all clients. Type-specific fields are optional.
 */
export interface ILead {
  tenant: Types.ObjectId;
  tenantName: string;
  type: LeadType;
  status: LeadStatus;
  notes?: string;

  name: string;
  email: string;
  phone?: string;

  // enquiry
  product?: Types.ObjectId;
  productName?: string;
  quantity?: number;
  deliveryAddress?: string;
  message?: string;

  // distributor
  businessName?: string;
  state?: string;
  city?: string;

  // contact
  subject?: string;

  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    tenantName: { type: String, required: true },
    type: { type: String, enum: LEAD_TYPES, required: true },
    status: { type: String, enum: LEAD_STATUSES, default: "new" },
    notes: String,

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,

    product: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: String,
    quantity: Number,
    deliveryAddress: String,
    message: String,

    businessName: String,
    state: String,
    city: String,

    subject: String,
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ tenant: 1, createdAt: -1 });

export const Lead: Model<ILead> =
  (models.Lead as Model<ILead>) || model<ILead>("Lead", LeadSchema);
