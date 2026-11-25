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
