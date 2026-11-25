import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { badRequest, requireSession, unauthorized } from "@/lib/adminApi";
import { ACTIVE_TENANT_COOKIE } from "@/lib/adminTenant";
import { Tenant } from "@/models/Tenant";

export async function POST(req: Request) {
  if (!(await requireSession())) return unauthorized();
  const parsed = z.object({ tenantId: z.string().regex(/^[a-f0-9]{24}$/i) }).safeParse(await req.json());
  if (!parsed.success) return badRequest("Invalid client.");

  await connectDB();
  if (!(await Tenant.exists({ _id: parsed.data.tenantId }))) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACTIVE_TENANT_COOKIE, parsed.data.tenantId, { path: "/", sameSite: "lax", httpOnly: true });
  return res;
}
