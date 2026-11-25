import { Schema, models, model, Model } from "mongoose";

/** Single-document settings for the openCare platform itself. */
export interface IPlatform {
  key: "default";
  name: string;
  leadWhatsApp: string;
  leadPhone: string;
  leadEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlatformSchema = new Schema<IPlatform>(
  {
    key: { type: String, default: "default", unique: true },
    name: { type: String, default: "openCare" },
    leadWhatsApp: { type: String, default: "" },
    leadPhone: { type: String, default: "" },
    leadEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Platform: Model<IPlatform> =
  (models.Platform as Model<IPlatform>) || model<IPlatform>("Platform", PlatformSchema);
