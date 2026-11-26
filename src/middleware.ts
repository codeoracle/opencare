import { NextResponse, type NextRequest } from "next/server";
import {
  CLIENT_HEADER,
  DOMAIN_CLIENT,
  isPlatformHost,
  normalizeHost,
  platformRootDomain,
  PREVIEW_COOKIE,
  RESERVED_PATHS,
  STORE_PREFIX,
} from "@/lib/hosts";

const SLUG = /^[a-z0-9-]{1,42}$/;

function rewrite(req: NextRequest, pathname: string, client?: string) {
  const headers = new Headers(req.headers);
  headers.delete(CLIENT_HEADER); // never trust a header the browser sent
  if (client) headers.set(CLIENT_HEADER, client);
  const dest = req.nextUrl.clone();
  dest.pathname = pathname;
  return NextResponse.rewrite(dest, { request: { headers } });
}

/**
 * Routing:
 *  - Platform domain: "/" is the openCare home page; "/<slug>/..." is that
 *    brand's store, served internally from /s/<slug>/... so each brand is its
 *    own route segment (navigating between brands and home swaps the layout).
 *  - Brand domains/subdomains: every page is served from /s/_d/... and the brand
 *    is found from the host.
 *  - Old ?client=<slug> links redirect to /<slug>.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const host = normalizeHost(req.headers.get("x-forwarded-host") || req.headers.get("host"));
  const onPlatform = isPlatformHost(host);

  // The internal prefix is not a public address.
  if (path === STORE_PREFIX || path.startsWith(`${STORE_PREFIX}/`)) {
    return rewrite(req, "/_not-found");
  }

  if (!onPlatform) {
    if (path.startsWith("/admin")) {
      const root = platformRootDomain();
      if (process.env.NODE_ENV === "production" && root) {
        return NextResponse.redirect(`https://${root}${path}${url.search}`);
      }
      return rewrite(req, path);
    }
    if (path.startsWith("/api")) return rewrite(req, path);
    return rewrite(req, `${STORE_PREFIX}/${DOMAIN_CLIENT}${path === "/" ? "" : path}`);
  }

  if (url.searchParams.has("client") && !path.startsWith("/admin")) {
    const slug = (url.searchParams.get("client") || "").toLowerCase();
    const dest = url.clone();
    dest.searchParams.delete("client");
    dest.pathname = SLUG.test(slug) ? `/${slug}` : "/";
    const res = NextResponse.redirect(dest);
    res.cookies.delete(PREVIEW_COOKIE);
    return res;
  }

  const [first, ...rest] = path.split("/").filter(Boolean);
  if (first && !RESERVED_PATHS.has(first) && SLUG.test(first)) {
    // Brand form posts: /<slug>/api/... → /api/... with the brand header.
    if (rest[0] === "api") return rewrite(req, `/${rest.join("/")}`, first);
    return rewrite(req, `${STORE_PREFIX}/${first}${rest.length ? `/${rest.join("/")}` : ""}`, first);
  }

  return rewrite(req, path);
}

export const config = {
  // Static files (anything with a dot), Next internals and brand images are skipped.
  matcher: ["/((?!_next/|images/|clients/|favicon.ico|.*\\.[a-z0-9]+$).*)"],
};
