import { platformRootDomain } from "@/lib/hosts";

/** Best public URL for a client: custom domain → platform subdomain → local preview. */
export function clientSiteUrl(c: { slug: string; domains?: string[] }) {
  if (c.domains?.length) return `https://${c.domains[0]}`;
  const root = platformRootDomain();
  if (root) return `https://${c.slug}.${root}`;
  return clientPreviewUrl(c);
}

/** Preview on the platform domain itself; works before DNS is set up. */
export function clientPreviewUrl(c: { slug: string }) {
  const base = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}/${c.slug}`;
}
