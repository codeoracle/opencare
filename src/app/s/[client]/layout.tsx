import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ConditionalWhatsAppFloat } from "@/components/ConditionalWhatsAppFloat";
import { FacebookPixel } from "@/components/FacebookPixel";
import { notFound } from "next/navigation";
import {
  getBasePath,
  getCurrentTenant,
  isPlatformRequest,
} from "@/lib/tenant";
import { BasePathProvider } from "@/components/BasePath";
import { BrandBar } from "@/components/BrandBar";
import { themeVars } from "@/lib/theme";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
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

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getCurrentTenant();

  // Unknown brand (or a hidden one): 404.
  if (!tenant) notFound();
  const [viaPlatform, basePath] = await Promise.all([
    isPlatformRequest(),
    getBasePath(),
  ]);

  return (
    <BasePathProvider base={basePath}>
      <div
        className="oc-site flex min-h-screen flex-col"
        data-heading={tenant.headingFont}
        style={themeVars(tenant.primaryColor, tenant.accentColor)}
      >
        <FacebookPixel
          pixelIds={tenant.facebookPixelIds}
          conversionEvents={tenant.facebookConversionEvents}
        />
        {viaPlatform ? (
          <BrandBar
            platformName={process.env.PLATFORM_NAME || "openCare"}
            brandName={tenant.name}
          />
        ) : null}
        <SiteHeader
          name={tenant.name}
          logoUrl={tenant.logoUrl}
          showNameWithLogo={tenant.showNameWithLogo}
          enableDistributors={tenant.enableDistributors}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter tenant={tenant} basePath={basePath} />
        {tenant.contact.whatsapp ? (
          <ConditionalWhatsAppFloat
            phone={tenant.contact.whatsapp}
            businessName={tenant.name}
          />
        ) : null}
      </div>
    </BasePathProvider>
  );
}
