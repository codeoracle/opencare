import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiErrors";
import { requireTenantScope } from "@/lib/adminApi";
import { uploadProductImageServer } from "@/lib/uploadProductImage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const scope = await requireTenantScope();
  if (!scope.ok) return scope.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Uploads are filed per client; the optional client id (from the client
    // settings page) must be a valid ObjectId so it cannot escape the folder.
    const requested = String(formData.get("clientId") || "");
    const clientId = /^[a-f0-9]{24}$/i.test(requested) ? requested : String(scope.tenantId);

    const url = await uploadProductImageServer(file, `clients/${clientId}`);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    return apiErrorResponse(err, "Image upload failed.");
  }
}
