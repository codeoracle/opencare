import { NextResponse } from "next/server";
import { z } from "zod";
import { apiErrorResponse } from "@/lib/apiErrors";
import { isBot, recordLead } from "@/lib/leads";

const schema = z.object({
  name: z.string().trim().min(2),
  businessName: z.string().trim().min(2),
  email: z.string().trim().email(),
  whatsapp: z.string().trim().min(6),
  state: z.string().trim().min(2),
  city: z.string().trim().min(2),
  message: z.string().trim().max(5000).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    if (isBot(json)) return NextResponse.json({ ok: true });
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const { whatsapp, ...rest } = parsed.data;
    return await recordLead(req, () => ({ ...rest, phone: whatsapp, type: "distributor" as const }));
  } catch (err) {
    return apiErrorResponse(err, "Failed to submit application.");
  }
}
