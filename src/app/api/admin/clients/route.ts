import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { badRequest, isDuplicateKeyError, requireSession, unauthorized } from "@/lib/adminApi";
import { Tenant } from "@/models/Tenant";
import { cleanDomains, invalidateTenantCache } from "@/lib/tenant";
import { createTenantSchema, defaultSlug, slugSchema } from "@/lib/tenantInput";
import { ACTIVE_TENANT_COOKIE } from "@/lib/adminTenant";

export async function POST(req: Request) {
  if (!(await requireSession())) return unauthorized();

  try {
    const parsed = createTenantSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest(parsed.error.flatten());

    const slug = slugSchema.safeParse(defaultSlug(parsed.data.name, parsed.data.slug));
    if (!slug.success) return badRequest(slug.error.issues[0]?.message || "Invalid subdomain.");

    await connectDB();
    const tenant = await Tenant.create({
      name: parsed.data.name,
      slug: slug.data,
      domains: cleanDomains(parsed.data.domains),
      tagline: "",
      heroTitle: parsed.data.name,
    });
    invalidateTenantCache();

    // Switch the admin straight to the new client.
    const res = NextResponse.json({ ok: true, id: String(tenant._id) });
    res.cookies.set(ACTIVE_TENANT_COOKIE, String(tenant._id), { path: "/", sameSite: "lax", httpOnly: true });
    return res;
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return NextResponse.json({ error: "That subdomain or domain is already used by another client." }, { status: 409 });
    }
    return apiErrorResponse(err, "Failed to create client.");
  }
}
