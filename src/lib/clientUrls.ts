import { siteUrl } from "@/lib/hosts";

/** Public URL for a client: its own domain if set, otherwise its path on the openCare site. */
export function clientSiteUrl(c: { slug: string; domains?: string[] }) {
  if (c.domains?.length) return `https://${c.domains[0]}`;
  return clientPreviewUrl(c);
}

/** The brand's page on the openCare site, e.g. https://theopencare.com.ng/bilef. */
export function clientPreviewUrl(c: { slug: string }) {
  return `${siteUrl()}/${c.slug}`;
}
