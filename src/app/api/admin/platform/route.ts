import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { badRequest, requireSession, unauthorized } from "@/lib/adminApi";
import { Platform } from "@/models/Platform";
import { invalidateTenantCache } from "@/lib/tenant";

const schema = z.object({
  name: z.string().trim().min(2),
  leadWhatsApp: z.string().trim().min(6),
  leadPhone: z.string().trim().optional().default(""),
  leadEmail: z.string().trim().email(),
});

export async function PUT(req: Request) {
  if (!(await requireSession())) return unauthorized();
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return badRequest(parsed.error.issues[0]?.message || "Invalid input.");
    await connectDB();
    await Platform.findOneAndUpdate({ key: "default" }, { ...parsed.data, key: "default" }, { upsert: true });
    invalidateTenantCache();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err, "Failed to save settings.");
  }
}
