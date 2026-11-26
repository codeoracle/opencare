import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ConditionalWhatsAppFloat } from "@/components/ConditionalWhatsAppFloat";
import { FacebookPixel } from "@/components/FacebookPixel";
import { getCurrentTenant, isPlatformRequest } from "@/lib/tenant";
import { BrandBar } from "@/components/BrandBar";
import { themeVars } from "@/lib/theme";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  if (!tenant) {
    const name = process.env.PLATFORM_NAME || "openCare";
    return {
      title: `${name}: Distributor in Nigeria`,
      description: `${name} is a Nigerian distributor partnering with manufacturers to market and sell their products and give their brands publicity. Browse our brands and order retail or wholesale.`,
    };
  }
  return {
    title: { default: tenant.metaTitle, template: `%s · ${tenant.name}` },
    description: tenant.metaDescription || undefined,
    icons: tenant.logoUrl ? { icon: tenant.logoUrl } : undefined,
    openGraph: {
      title: tenant.metaTitle,
      description: tenant.metaDescription || undefined,
      images: tenant.heroImage ? [tenant.heroImage] : undefined,
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getCurrentTenant();

  // Platform domain with no client selected: the page renders the openCare landing.
  if (!tenant) return <>{children}</>;
  const viaPlatform = await isPlatformRequest();

  return (
    <div
      className="oc-site flex min-h-screen flex-col"
      data-heading={tenant.headingFont}
      style={themeVars(tenant.primaryColor, tenant.accentColor)}
    >
      <FacebookPixel pixelIds={tenant.facebookPixelIds} conversionEvents={tenant.facebookConversionEvents} />
      {viaPlatform ? <BrandBar platformName={process.env.PLATFORM_NAME || "openCare"} brandName={tenant.name} /> : null}
      <SiteHeader
        name={tenant.name}
        logoUrl={tenant.logoUrl}
        showNameWithLogo={tenant.showNameWithLogo}
        enableDistributors={tenant.enableDistributors}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter tenant={tenant} />
      {tenant.contact.whatsapp ? (
        <ConditionalWhatsAppFloat phone={tenant.contact.whatsapp} businessName={tenant.name} />
      ) : null}
    </div>
  );
}
