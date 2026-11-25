import { cookies } from "next/headers";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Tenant } from "@/models/Tenant";

/** Which client the admin is currently managing in the catalogue screens. */
export const ACTIVE_TENANT_COOKIE = "oc_active_client";

export type AdminTenantRef = { _id: string; name: string; slug: string };

export async function listTenantRefs(): Promise<AdminTenantRef[]> {
  await connectDB();
  const rows = await Tenant.find({}).select("name slug").sort({ name: 1 }).lean();
  return rows.map((t) => ({ _id: String(t._id), name: t.name, slug: t.slug }));
}

/**
 * The admin's active client. Falls back to the first client when the cookie is
 * missing or stale. Returns null only when no clients exist yet.
 */
export async function getActiveTenant(): Promise<AdminTenantRef | null> {
  await connectDB();
  const id = (await cookies()).get(ACTIVE_TENANT_COOKIE)?.value;
  if (id && Types.ObjectId.isValid(id)) {
    const t = await Tenant.findById(id).select("name slug").lean();
    if (t) return { _id: String(t._id), name: t.name, slug: t.slug };
  }
  const first = await Tenant.findOne({}).select("name slug").sort({ name: 1 }).lean();
  return first ? { _id: String(first._id), name: first.name, slug: first.slug } : null;
}

/** For admin API routes: the active client's id, or null. */
export async function getActiveTenantId() {
  const t = await getActiveTenant();
  return t ? new Types.ObjectId(t._id) : null;
}
