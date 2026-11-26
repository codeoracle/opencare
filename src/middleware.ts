import { NextResponse, type NextRequest } from "next/server";
import {
  CLIENT_HEADER,
  isPlatformHost,
  normalizeHost,
  platformRootDomain,
  PREVIEW_COOKIE,
  RESERVED_PATHS,
} from "@/lib/hosts";

/**
 * Brand addresses on the platform domain: /<slug>/... is served by the normal
 * pages with the brand passed in a request header, so every brand has its own
 * link (theopencare.netlify.app/bilef). Old ?client=<slug> links redirect there.
 * On client domains in production, /admin goes to the platform domain.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = normalizeHost(req.headers.get("x-forwarded-host") || req.headers.get("host"));
  const onPlatform = isPlatformHost(host);

  if (!onPlatform && process.env.NODE_ENV === "production" && url.pathname.startsWith("/admin")) {
    const root = platformRootDomain();
    if (root) return NextResponse.redirect(`https://${root}${url.pathname}${url.search}`);
  }

  // Legacy preview links: /?client=bilef → /bilef (and clear the old cookie).
  if (url.searchParams.has("client") && !url.pathname.startsWith("/admin")) {
    const slug = (url.searchParams.get("client") || "").toLowerCase();
    const dest = url.clone();
    dest.searchParams.delete("client");
    dest.pathname = /^[a-z0-9-]{1,42}$/.test(slug) ? `/${slug}` : "/";
    const res = NextResponse.redirect(dest);
    res.cookies.delete(PREVIEW_COOKIE);
    return res;
  }

  const [first, ...rest] = url.pathname.split("/").filter(Boolean);
  if (onPlatform && first && !RESERVED_PATHS.has(first) && /^[a-z0-9-]{1,42}$/.test(first)) {
    const headers = new Headers(req.headers);
    headers.set(CLIENT_HEADER, first);
    const dest = url.clone();
    dest.pathname = `/${rest.join("/")}`;
    return NextResponse.rewrite(dest, { request: { headers } });
  }

  // Never trust a client header sent by the browser itself.
  if (req.headers.has(CLIENT_HEADER)) {
    const headers = new Headers(req.headers);
    headers.delete(CLIENT_HEADER);
    return NextResponse.next({ request: { headers } });
  }
  return NextResponse.next();
}

export const config = {
  // Static files (anything with a dot), Next internals and brand images are skipped.
  matcher: ["/((?!_next/|images/|clients/|favicon.ico|.*\\.[a-z0-9]+$).*)"],
};
