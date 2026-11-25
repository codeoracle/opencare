import { z } from "zod";
import { createSlug } from "@/lib/utils";
import { cleanDomains } from "@/lib/tenant";
import { parseFacebookPixelConfig } from "@/lib/facebookPixel";
import { safeHex } from "@/lib/theme";

const str = z.string().trim().optional().default("");
const titled = z.array(z.object({ title: z.string().trim(), desc: z.string().trim().default("") }));

const RESERVED_SLUGS = new Set(["www", "admin", "api", "app", "mail", "opencare"]);

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9](?:[a-z0-9-]{0,40}[a-z0-9])?$/, "Use lowercase letters, numbers and dashes.")
  .refine((s) => !RESERVED_SLUGS.has(s), "That name is reserved.");

export const createTenantSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().optional(),
  domains: z.union([z.string(), z.array(z.string())]).optional(),
});

export const tenantSchema = z.object({
  name: z.string().trim().min(2),
  slug: slugSchema,
  domains: z.union([z.string(), z.array(z.string())]).optional(),
  isActive: z.boolean().default(true),

  logoUrl: str,
  primaryColor: str,
  accentColor: str,
  headingFont: z.enum(["serif", "sans"]).default("sans"),

  tagline: str,
  heroEyebrow: str,
  heroTitle: str,
  heroSubtitle: str,
  heroImage: str,
  aboutTitle: str,
  aboutIntro: str,
  about: str,
  aboutImage: str,
  stats: z.array(z.object({ label: z.string().trim(), value: z.string().trim() })).default([]),
  highlights: titled.default([]),
  audiences: z.array(z.string().trim()).default([]),
  faqs: z.array(z.object({ q: z.string().trim(), a: z.string().trim() })).default([]),
  distributorIntro: str,
  distributorBenefits: titled.default([]),
  footerBlurb: str,
  location: str,
  facebook: str,
  instagram: str,
  twitter: str,
  linkedin: str,

  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/).default("NGN"),
  showPrices: z.boolean().default(true),
  enableDistributors: z.boolean().default(true),

  contactWhatsApp: str,
  contactPhone: str,
  contactEmail: z.union([z.literal(""), z.string().trim().email()]).default(""),

  metaTitle: str,
  metaDescription: str,
  facebookPixelBaseCode: str,
  facebookConversionCode: str,
});

export type TenantInput = z.infer<typeof tenantSchema>;

export function defaultSlug(name: string, slug?: string) {
  return createSlug(slug || name).slice(0, 42).replace(/-+$/, "");
}

/** Convert validated form input into the Tenant document shape. */
export function toTenantFields(d: TenantInput) {
  const pixel = parseFacebookPixelConfig({
    baseCode: d.facebookPixelBaseCode,
    conversionCode: d.facebookConversionCode,
  });
  return {
    name: d.name,
    slug: d.slug,
    domains: cleanDomains(d.domains),
    isActive: d.isActive,
    logoUrl: d.logoUrl,
    primaryColor: safeHex(d.primaryColor, "#2563eb"),
    accentColor: safeHex(d.accentColor, "#f97316"),
    headingFont: d.headingFont,
    tagline: d.tagline,
    heroEyebrow: d.heroEyebrow,
    heroTitle: d.heroTitle,
    heroSubtitle: d.heroSubtitle,
    heroImage: d.heroImage,
    aboutTitle: d.aboutTitle,
    aboutIntro: d.aboutIntro,
    about: d.about,
    aboutImage: d.aboutImage,
    stats: d.stats.filter((x) => x.label && x.value),
    highlights: d.highlights.filter((x) => x.title),
    audiences: d.audiences.filter(Boolean),
    faqs: d.faqs.filter((x) => x.q && x.a),
    distributorIntro: d.distributorIntro,
    distributorBenefits: d.distributorBenefits.filter((x) => x.title),
    footerBlurb: d.footerBlurb,
    location: d.location,
    socialLinks: { facebook: d.facebook, instagram: d.instagram, twitter: d.twitter, linkedin: d.linkedin },
    currency: d.currency,
    showPrices: d.showPrices,
    enableDistributors: d.enableDistributors,
    contactWhatsApp: d.contactWhatsApp,
    contactPhone: d.contactPhone,
    contactEmail: d.contactEmail,
    metaTitle: d.metaTitle,
    metaDescription: d.metaDescription,
    facebookPixelBaseCode: d.facebookPixelBaseCode,
    facebookConversionCode: d.facebookConversionCode,
    facebookPixelIds: pixel.pixelIds,
    facebookConversionEvents: pixel.conversionEvents,
  };
}
