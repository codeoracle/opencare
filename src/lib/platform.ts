import { cache } from "react";
import { connectDB } from "@/lib/db";
import { Platform } from "@/models/Platform";

export type PlatformSettings = {
  name: string;
  leadWhatsApp: string;
  leadPhone: string;
  leadEmail: string;
};

export function envPlatformDefaults(): PlatformSettings {
  return {
    name: process.env.PLATFORM_NAME || "openCare",
    leadWhatsApp: process.env.LEAD_WHATSAPP || "",
    leadPhone: process.env.LEAD_PHONE || process.env.LEAD_WHATSAPP || "",
    leadEmail: process.env.LEAD_EMAIL || "",
  };
}

/** Platform settings from the DB, with env values filling any blanks. */
export const getPlatform = cache(async (): Promise<PlatformSettings> => {
  const defaults = envPlatformDefaults();
  await connectDB();
  const doc = await Platform.findOne({ key: "default" }).lean();
  return {
    name: doc?.name || defaults.name,
    leadWhatsApp: doc?.leadWhatsApp || defaults.leadWhatsApp,
    leadPhone: doc?.leadPhone || defaults.leadPhone,
    leadEmail: doc?.leadEmail || defaults.leadEmail,
  };
});
