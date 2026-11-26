import { Schema, models, model, Model, Types } from "mongoose";

export type TitledText = { title: string; desc: string };
export type StatItem = { label: string; value: string };
export type FaqItem = { q: string; a: string };

export interface ITenant {
  _id: Types.ObjectId;
  /** Client / manufacturer display name, e.g. "Acme Paints Ltd". */
  name: string;
  /** Used for the platform subdomain: <slug>.<PLATFORM_ROOT_DOMAIN>. */
  slug: string;
  /** Custom domains that serve this client's site, e.g. ["acmepaints.com", "www.acmepaints.com"]. */
  domains: string[];
  isActive: boolean;

  // Branding
  logoUrl?: string;
  /** Show the client name beside the logo (for icon-style logos). */
  showNameWithLogo?: boolean;
  primaryColor: string;
  accentColor: string;
  headingFont: "serif" | "sans";

  // Site content
  tagline?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  aboutTitle?: string;
  aboutIntro?: string;
  about?: string;
  aboutImage?: string;
  stats: StatItem[];
  highlights: TitledText[];
  audiences: string[];
  faqs: FaqItem[];
  distributorIntro?: string;
  distributorBenefits: TitledText[];
  footerBlurb?: string;
  location?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };

  // Catalogue behaviour
  currency: string;
  showPrices: boolean;
  enableDistributors: boolean;

  // Optional contact overrides — empty means the openCare lead contacts are used.
  contactWhatsApp?: string;
  contactPhone?: string;
  contactEmail?: string;

  // SEO / tracking
  metaTitle?: string;
  metaDescription?: string;
  facebookPixelIds: string[];
  facebookPixelBaseCode?: string;
  facebookConversionCode?: string;
  facebookConversionEvents: string[];

  createdAt: Date;
  updatedAt: Date;
}

const titled = { title: { type: String, required: true }, desc: { type: String, default: "" } };

const TenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    domains: [{ type: String, lowercase: true, trim: true }],
    isActive: { type: Boolean, default: true },

    logoUrl: String,
    showNameWithLogo: { type: Boolean, default: false },
    primaryColor: { type: String, default: "#2563eb" },
    accentColor: { type: String, default: "#f97316" },
    headingFont: { type: String, enum: ["serif", "sans"], default: "sans" },

    tagline: String,
    heroEyebrow: String,
    heroTitle: String,
    heroSubtitle: String,
    heroImage: String,
    aboutTitle: String,
    aboutIntro: String,
    about: String,
    aboutImage: String,
    stats: [{ label: { type: String, required: true }, value: { type: String, required: true } }],
    highlights: [titled],
    audiences: [{ type: String }],
    faqs: [{ q: { type: String, required: true }, a: { type: String, required: true } }],
    distributorIntro: String,
    distributorBenefits: [titled],
    footerBlurb: String,
    location: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
    },

    currency: { type: String, default: "NGN" },
    showPrices: { type: Boolean, default: true },
    enableDistributors: { type: Boolean, default: true },

    contactWhatsApp: String,
    contactPhone: String,
    contactEmail: String,

    metaTitle: String,
    metaDescription: String,
    facebookPixelIds: [{ type: String }],
    facebookPixelBaseCode: String,
    facebookConversionCode: String,
    facebookConversionEvents: [{ type: String }],
  },
  { timestamps: true }
);

// A domain can belong to only one client. The partial filter matters: clients
// with no custom domain (empty array) must not collide with each other.
TenantSchema.index(
  { domains: 1 },
  { unique: true, partialFilterExpression: { "domains.0": { $exists: true } }, name: "domains_unique" }
);

export const Tenant: Model<ITenant> =
  (models.Tenant as Model<ITenant>) || model<ITenant>("Tenant", TenantSchema);
