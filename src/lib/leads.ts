import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getTenantForRequest } from "@/lib/tenant";
import { getPlatform } from "@/lib/platform";
import { leadEmail, sendEmail } from "@/lib/email";
import { Lead, type ILead } from "@/models/Lead";
import type { ITenant } from "@/models/Tenant";

type LeadFields = Omit<Partial<ILead>, "tenant" | "tenantName" | "status"> &
  Pick<ILead, "type" | "name" | "email">;

/**
 * Save a lead for the client that owns this request's domain and email it to
 * the openCare lead inbox. Returns a 404 response when the host is not a client.
 */
export async function recordLead(
  req: Request,
  build: (tenant: ITenant) => Promise<LeadFields | NextResponse> | LeadFields | NextResponse
) {
  await connectDB();
  const tenant = await getTenantForRequest(req);
  if (!tenant) return NextResponse.json({ error: "Unknown site." }, { status: 404 });

  const fields = await build(tenant);
  if (fields instanceof NextResponse) return fields;

  const lead = await Lead.create({ ...fields, tenant: tenant._id, tenantName: tenant.name, status: "new" });

  const platform = await getPlatform();
  const adminBase = process.env.SITE_URL?.replace(/\/$/, "");
  const email = leadEmail(
    { ...fields, tenantName: tenant.name },
    adminBase ? `${adminBase}/admin/dashboard?client=${tenant._id}` : undefined
  );
  try {
    await sendEmail({ ...email, to: platform.leadEmail || undefined });
  } catch (err) {
    // The lead is already saved; a mail failure should not lose it.
    console.error("[lead] email failed", err);
  }

  return NextResponse.json({ ok: true, id: String(lead._id) });
}

/** Bots fill hidden fields; real visitors leave the honeypot empty. */
export function isBot(json: unknown) {
  return !!json && typeof json === "object" && !!(json as Record<string, unknown>).website;
}
