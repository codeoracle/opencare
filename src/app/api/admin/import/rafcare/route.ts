import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiErrors";
import { requireSession, unauthorized } from "@/lib/adminApi";
import { importRafcare } from "@/lib/clientImports/rafcare";

export const maxDuration = 60;

/** Loads (or refreshes) the RAFCARE client and its 68-product catalogue. */
export async function POST() {
  if (!(await requireSession())) return unauthorized();
  try {
    const result = await importRafcare();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return apiErrorResponse(err, "RAFCARE import failed.");
  }
}
