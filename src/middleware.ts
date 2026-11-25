import { NextResponse, type NextRequest } from "next/server";
import { isPlatformHost, normalizeHost, platformRootDomain, PREVIEW_COOKIE } from "@/lib/hosts";

/**
 * - On the platform's own domain, `?client=<slug>` previews that client's site
 *   (stored in a cookie; `?client=` with no value clears it).
 * - On client domains in production, /admin is sent to the platform domain so
 *   the admin login never appears on a client's site.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = normalizeHost(req.headers.get("x-forwarded-host") || req.headers.get("host"));
  const onPlatform = isPlatformHost(host);

  if (!onPlatform && process.env.NODE_ENV === "production" && url.pathname.startsWith("/admin")) {
    const root = platformRootDomain();
    if (root) return NextResponse.redirect(`https://${root}${url.pathname}${url.search}`);
  }

  if (onPlatform && url.searchParams.has("client")) {
    const slug = (url.searchParams.get("client") || "").toLowerCase();
    // Leave admin links like /admin/dashboard?client=<id> alone.
    if (url.pathname.startsWith("/admin")) return NextResponse.next();

    const clean = url.clone();
    clean.searchParams.delete("client");
    const res = NextResponse.redirect(clean);
    if (/^[a-z0-9-]{1,42}$/.test(slug)) {
      res.cookies.set(PREVIEW_COOKIE, slug, { path: "/", sameSite: "lax" });
    } else {
      res.cookies.delete(PREVIEW_COOKIE);
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|images/).*)"],
};
