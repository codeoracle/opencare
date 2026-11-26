import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminTenant } from "@/lib/adminQueries";
import { TenantForm, type TenantFormValues } from "@/components/admin/TenantForm";
import { platformRootDomain } from "@/lib/hosts";
import { getPlatform } from "@/lib/platform";
import { clientPreviewUrl, clientSiteUrl } from "@/lib/clientUrls";
import { formatPhoneDisplay } from "@/lib/utils";
import { ActivateClientLink } from "@/components/admin/ActivateClientLink";

export default async function AdminClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [t, platform] = await Promise.all([getAdminTenant(id), getPlatform()]);
  if (!t) notFound();

  const s = (v: unknown) => (v == null ? "" : String(v));
  const pairs = <T extends Record<string, string>>(list: unknown, keys: (keyof T)[]) =>
    (Array.isArray(list) ? list : []).map(
      (row) => Object.fromEntries(keys.map((k) => [k, s((row as Record<string, unknown>)[k as string])])) as T
    );

  const initial: TenantFormValues = {
    name: t.name,
    slug: t.slug,
    domains: (t.domains || []).join("\n"),
    isActive: t.isActive,
    logoUrl: s(t.logoUrl),
    showNameWithLogo: !!t.showNameWithLogo,
    primaryColor: s(t.primaryColor) || "#2563eb",
    accentColor: s(t.accentColor) || "#f97316",
    headingFont: t.headingFont === "serif" ? "serif" : "sans",
    tagline: s(t.tagline),
    heroEyebrow: s(t.heroEyebrow),
    heroTitle: s(t.heroTitle),
    heroSubtitle: s(t.heroSubtitle),
    heroImage: s(t.heroImage),
    aboutTitle: s(t.aboutTitle),
    aboutIntro: s(t.aboutIntro),
    about: s(t.about),
    aboutImage: s(t.aboutImage),
    stats: pairs<{ label: string; value: string }>(t.stats, ["label", "value"]),
    highlights: pairs<{ title: string; desc: string }>(t.highlights, ["title", "desc"]),
    audiences: (t.audiences || []).join("\n"),
    faqs: pairs<{ q: string; a: string }>(t.faqs, ["q", "a"]),
    distributorIntro: s(t.distributorIntro),
    distributorBenefits: pairs<{ title: string; desc: string }>(t.distributorBenefits, ["title", "desc"]),
    footerBlurb: s(t.footerBlurb),
    location: s(t.location),
    facebook: s(t.socialLinks?.facebook),
    instagram: s(t.socialLinks?.instagram),
    twitter: s(t.socialLinks?.twitter),
    linkedin: s(t.socialLinks?.linkedin),
    currency: s(t.currency) || "NGN",
    showPrices: t.showPrices !== false,
    enableDistributors: t.enableDistributors !== false,
    contactWhatsApp: s(t.contactWhatsApp),
    contactPhone: s(t.contactPhone),
    contactEmail: s(t.contactEmail),
    metaTitle: s(t.metaTitle),
    metaDescription: s(t.metaDescription),
    facebookPixelBaseCode: s(t.facebookPixelBaseCode),
    facebookConversionCode: s(t.facebookConversionCode),
  };

  const ref = { slug: t.slug, domains: t.domains };

  return (
    <div>
      <Link href="/admin/clients" className="text-[13px] font-semibold text-black/50 hover:text-black">
        ← All clients
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[30px] font-semibold">{t.name}</h1>
          <a href={clientSiteUrl(ref)} target="_blank" rel="noreferrer" className="text-[13px] text-black/55 hover:underline">
            {clientSiteUrl(ref).replace(/^https?:\/\//, "")} ↗
          </a>
        </div>
        <ActivateClientLink id={String(t._id)} />
      </div>
      <div className="mt-6">
        <TenantForm
          id={String(t._id)}
          initial={initial}
          rootDomain={platformRootDomain()}
          previewUrl={clientPreviewUrl(ref)}
          leadDefaults={{
            whatsapp: platform.leadWhatsApp ? formatPhoneDisplay(platform.leadWhatsApp) : "",
            phone: platform.leadPhone ? formatPhoneDisplay(platform.leadPhone) : "",
            email: platform.leadEmail,
          }}
        />
      </div>
    </div>
  );
}
