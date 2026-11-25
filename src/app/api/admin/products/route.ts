import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { badRequest, requireTenantScope } from "@/lib/adminApi";
import { Product } from "@/models/Product";
import { InputError, productSchema, toProductFields, uniqueProductSlug } from "@/lib/productInput";

export async function POST(req: Request) {
  const scope = await requireTenantScope();
  if (!scope.ok) return scope.response;

  try {
    const parsed = productSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest(parsed.error.flatten());

    await connectDB();
    const fields = await toProductFields(scope.tenantId, parsed.data);
    const product = await Product.create({
      ...fields,
      tenant: scope.tenantId,
      slug: await uniqueProductSlug(scope.tenantId, parsed.data.name),
    });

    return NextResponse.json({ ok: true, product });
  } catch (err) {
    if (err instanceof InputError) return badRequest(err.message);
    return apiErrorResponse(err, "Failed to create product.");
  }
}
