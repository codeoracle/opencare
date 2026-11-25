import { NextResponse } from "next/server";
import { z } from "zod";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { badRequest, requireSession, unauthorized } from "@/lib/adminApi";
import { Lead, LEAD_STATUSES } from "@/models/Lead";

const schema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: z.string().max(5000).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireSession())) return unauthorized();
  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return badRequest("Invalid lead id.");
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return badRequest(parsed.error.flatten());
    await connectDB();
    const lead = await Lead.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!lead) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err, "Failed to update lead.");
  }
}
