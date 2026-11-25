import { NextResponse } from "next/server";
import type { Types } from "mongoose";
import { getSession } from "@/lib/auth";
import { getActiveTenantId } from "@/lib/adminTenant";

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequest(error: unknown) {
  return NextResponse.json({ error }, { status: 400 });
}

/** Require an admin session; returns null when not signed in. */
export async function requireSession() {
  return getSession();
}

/**
 * Require an admin session AND an active client. Catalogue routes use this so
 * every read/write is scoped to the client selected in the admin switcher.
 */
export async function requireTenantScope(): Promise<
  { ok: true; tenantId: Types.ObjectId } | { ok: false; response: NextResponse }
> {
  const session = await getSession();
  if (!session) return { ok: false, response: unauthorized() };
  const tenantId = await getActiveTenantId();
  if (!tenantId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Create a client first." }, { status: 400 }),
    };
  }
  return { ok: true, tenantId };
}

export function isDuplicateKeyError(err: unknown) {
  return !!err && typeof err === "object" && "code" in err && (err as { code?: number }).code === 11000;
}
