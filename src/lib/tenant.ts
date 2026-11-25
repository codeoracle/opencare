import { cache } from "react";
import { cookies, headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { Tenant, type ITenant } from "@/models/Tenant";
import { getPlatform } from "@/lib/platform";
import { isPlatformHost, normalizeHost, PREVIEW_COOKIE, subdomainSlug } from "@/lib/hosts";
import { normalizeWhatsAppNumber } from "@/lib/utils";

/** Plain, serializable view of a client used by the public site. */
export type SiteTenant = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  headingFont: "serif" | "sans";
  tagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutIntro: string;
  about: string;
  aboutImage: string;
  stats: { label: string; value: string }[];
  highlights: { title: string; desc: string }[];
  audiences: string[];
  faqs: { q: string; a: string }[];
  distributorIntro: string;
  distributorBenefits: { title: string; desc: string }[];
  footerBlurb: string;
  location: string;
  socialLinks: { facebook: string; instagram: string; twitter: string; linkedin: string };
  currency: string;
  showPrices: boolean;
  enableDistributors: boolean;
  metaTitle: string;
  metaDescription: string;
  facebookPixelIds: string[];
  facebookConversionEvents: string[];
  /** Effective contacts shown on the site (client override → openCare lead contacts). */
  contact: { whatsapp: string; phone: string; email: string };
};

const s = (v: unknown) => (v == null ? "" : String(v));

function plainList<T>(list: unknown, map: (row: Record<string, unknown>) => T | null): T[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((row) => (row && typeof row === "object" ? map(row as Record<string, unknown>) : null))
    .filter((x): x is T => x !== null);
}

export function serializeTenant(
  doc: ITenant,
  platform: { leadWhatsApp: string; leadPhone: string; leadEmail: string }
): SiteTenant {
  const social = (doc.socialLinks || {}) as Record<string, unknown>;
  const whatsapp = normalizeWhatsAppNumber(doc.contactWhatsApp || platform.leadWhatsApp || "");
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    logoUrl: s(doc.logoUrl),
    primaryColor: s(doc.primaryColor) || "#2563eb",
    accentColor: s(doc.accentColor) || "#f97316",
    headingFont: doc.headingFont === "serif" ? "serif" : "sans",
    tagline: s(doc.tagline),
    heroEyebrow: s(doc.heroEyebrow),
    heroTitle: s(doc.heroTitle) || doc.name,
    heroSubtitle: s(doc.heroSubtitle) || s(doc.tagline),
    heroImage: s(doc.heroImage),
    aboutTitle: s(doc.aboutTitle) || `About ${doc.name}`,
    aboutIntro: s(doc.aboutIntro),
    about: s(doc.about),
    aboutImage: s(doc.aboutImage),
    stats: plainList(doc.stats, (r) => (r.label && r.value ? { label: s(r.label), value: s(r.value) } : null)),
    highlights: plainList(doc.highlights, (r) => (r.title ? { title: s(r.title), desc: s(r.desc) } : null)),
    audiences: (doc.audiences || []).map(s).filter(Boolean),
    faqs: plainList(doc.faqs, (r) => (r.q && r.a ? { q: s(r.q), a: s(r.a) } : null)),
    distributorIntro: s(doc.distributorIntro),
    distributorBenefits: plainList(doc.distributorBenefits, (r) =>
      r.title ? { title: s(r.title), desc: s(r.desc) } : null
    ),
    footerBlurb: s(doc.footerBlurb) || s(doc.tagline),
    location: s(doc.location),
    socialLinks: {
      facebook: s(social.facebook),
      instagram: s(social.instagram),
      twitter: s(social.twitter),
      linkedin: s(social.linkedin),
    },
    currency: s(doc.currency) || "NGN",
    showPrices: doc.showPrices !== false,
    enableDistributors: doc.enableDistributors !== false,
    metaTitle: s(doc.metaTitle) || doc.name,
    metaDescription: s(doc.metaDescription) || s(doc.tagline),
    facebookPixelIds: (doc.facebookPixelIds || []).map(s).filter(Boolean),
    facebookConversionEvents: (doc.facebookConversionEvents || []).map(s).filter(Boolean),
    contact: {
      whatsapp,
      phone: s(doc.contactPhone) || platform.leadPhone || "",
      email: s(doc.contactEmail) || platform.leadEmail || "",
    },
  };
}

// --- Host → tenant lookup with a short in-memory cache per server instance ---

type CacheEntry = { id: string | null; expires: number };
const TTL_MS = 30_000;

declare global {
  // eslint-disable-next-line no-var
  var __ocTenantHostCache: Map<string, CacheEntry> | undefined;
}
const hostCache: Map<string, CacheEntry> = (global.__ocTenantHostCache ??= new Map());

export function invalidateTenantCache() {
  hostCache.clear();
}

async function findTenantIdForKey(key: string, query: Record<string, unknown>) {
  const hit = hostCache.get(key);
  if (hit && hit.expires > Date.now()) return hit.id;
  const doc = await Tenant.findOne({ ...query, isActive: true }).select("_id").lean();
  const id = doc ? String(doc._id) : null;
  hostCache.set(key, { id, expires: Date.now() + TTL_MS });
  return id;
}

/** Work out which client a request host belongs to. */
export async function resolveTenantId(rawHost: string, previewSlug?: string | null) {
  const host = normalizeHost(rawHost);
  if (!host) return null;
  await connectDB();

  if (isPlatformHost(host)) {
    // The platform's own domain shows a client when previewing (?client=slug),
    // otherwise DEFAULT_CLIENT (if set), otherwise the openCare landing page.
    const slug = (previewSlug || process.env.DEFAULT_CLIENT || "").trim().toLowerCase();
    if (!slug) return null;
    return findTenantIdForKey(`slug:${slug}`, { slug });
  }

  const slug = subdomainSlug(host);
  if (slug) return findTenantIdForKey(`slug:${slug}`, { slug });

  return findTenantIdForKey(`domain:${host}`, { domains: host });
}

/** The client for the current request, or null on the platform's own domain. */
export const getCurrentTenant = cache(async (): Promise<SiteTenant | null> => {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const preview = (await cookies()).get(PREVIEW_COOKIE)?.value || null;
  const id = await resolveTenantId(host, preview);
  if (!id) return null;
  const [doc, platform] = await Promise.all([Tenant.findById(id).lean<ITenant>(), getPlatform()]);
  if (!doc || !doc.isActive) return null;
  return serializeTenant(doc, platform);
});

/** Same as getCurrentTenant but for route handlers that receive a Request. */
export async function getTenantForRequest(req: Request) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const preview = (await cookies()).get(PREVIEW_COOKIE)?.value || null;
  const id = await resolveTenantId(host, preview);
  if (!id) return null;
  return Tenant.findById(id).lean<ITenant>();
}

/** Turn free-form domain input into a clean list: "https://www.Acme.com/" → "acme.com". */
export function cleanDomains(input: string[] | string | undefined) {
  const list = typeof input === "string" ? input.split(/[\s,]+/) : input ?? [];
  return Array.from(new Set(list.map(normalizeHost).filter((d) => d && d.includes("."))));
}
