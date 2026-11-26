/**
 * Host helpers shared by middleware (edge runtime) and server code.
 * Keep this file free of Node-only imports.
 */

export const PREVIEW_COOKIE = "oc_preview_client";

export function platformRootDomain() {
  return normalizeHost(process.env.PLATFORM_ROOT_DOMAIN || "");
}

/** Lowercase, strip protocol, path, port and a leading "www.". */
export function normalizeHost(input: string | null | undefined) {
  if (!input) return "";
  let host = input.trim().toLowerCase();
  host = host.replace(/^[a-z]+:\/\//, "");
  host = host.split("/")[0];
  host = host.split(":")[0];
  if (host.startsWith("www.")) host = host.slice(4);
  return host;
}

/** Hosts that serve the openCare platform itself (admin, landing page, previews). */
export function isPlatformHost(host: string) {
  const root = platformRootDomain();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app") ||
    host.endsWith(".netlify.app") ||
    (!!root && host === root)
  );
}

/** "acme.opencare.ng" → "acme"; "acme.localhost" → "acme"; otherwise null. */
export function subdomainSlug(host: string) {
  const root = platformRootDomain();
  const suffixes = [".localhost"];
  if (root) suffixes.push(`.${root}`);
  for (const suffix of suffixes) {
    if (host.endsWith(suffix)) {
      const label = host.slice(0, -suffix.length);
      if (label && !label.includes(".")) return label;
    }
  }
  return null;
}

/**
 * Internal route prefix for brand stores: /s/<client>/... Never shown to visitors.
 * <client> is the brand slug on the platform domain, or DOMAIN_CLIENT on a
 * brand's own domain (the brand is then looked up from the host).
 */
export const STORE_PREFIX = "/s";
export const DOMAIN_CLIENT = "_d";

/** Request header set by middleware when a brand is opened by path: /<slug>/... */
export const CLIENT_HEADER = "x-oc-client";

/** First path segments that belong to the platform, never to a brand. */
export const RESERVED_PATHS = new Set([
  "s", "products", "about", "contact", "become-a-distributor",
  "admin", "api", "clients", "images", "_next", "favicon.ico", "robots.txt", "sitemap.xml",
]);

/** "/bilef" + "/products" → "/bilef/products"; "" + "/" → "/". */
export function withBase(base: string, path: string) {
  if (!base) return path;
  return path === "/" ? base : `${base}${path}`;
}

/** Public URL of the platform: SITE_URL, else https://<PLATFORM_ROOT_DOMAIN>, else localhost. */
export function siteUrl() {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const root = platformRootDomain();
  return root ? `https://${root}` : "http://localhost:3000";
}
