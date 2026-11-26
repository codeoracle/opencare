import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiErrors";
import { requireSession, unauthorized } from "@/lib/adminApi";
import { CLIENT_IMPORTS, isClientImportKey } from "@/lib/clientImports";

export const maxDuration = 60;

/** Loads (or refreshes) a ready-made client catalogue, e.g. /api/admin/import/rafcare. */
export async function POST(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  if (!(await requireSession())) return unauthorized();
  const { key } = await params;
  if (!isClientImportKey(key)) return NextResponse.json({ error: "Unknown client import." }, { status: 404 });
  try {
    const result = await CLIENT_IMPORTS[key].run();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return apiErrorResponse(err, `${CLIENT_IMPORTS[key].label} import failed.`);
  }
}
