import { NextResponse } from "next/server";
import { z } from "zod";
import { apiErrorResponse } from "@/lib/apiErrors";
import { isBot, recordLead } from "@/lib/leads";

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    if (isBot(json)) return NextResponse.json({ ok: true });
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    return await recordLead(req, () => ({ ...parsed.data, type: "contact" as const }));
  } catch (err) {
    return apiErrorResponse(err, "Failed to send message.");
  }
}
