import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { badRequest, requireTenantScope } from "@/lib/adminApi";
import { Product } from "@/models/Product";
import { InputError, productSchema, toProductFields, uniqueProductSlug } from "@/lib/productInput";

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const scope = await requireTenantScope();
  if (!scope.ok) return scope.response;

  try {
    const { slug } = await params;
    const parsed = productSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest(parsed.error.flatten());

    await connectDB();
    const product = await Product.findOne({ tenant: scope.tenantId, slug });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const fields = await toProductFields(scope.tenantId, parsed.data);
    const newSlug =
      product.name === parsed.data.name
        ? product.slug
        : await uniqueProductSlug(scope.tenantId, parsed.data.name, product._id);

    product.set({ ...fields, slug: newSlug });
    // set() ignores undefined, so clear optional fields explicitly.
    for (const key of ["price", "compareAtPrice", "brand", "category", "shortDescription"] as const) {
      if (fields[key] === undefined) product.set(key, undefined);
    }
    await product.save();

    return NextResponse.json({ ok: true, product, newSlug });
  } catch (err) {
    if (err instanceof InputError) return badRequest(err.message);
    return apiErrorResponse(err, "Failed to update product.");
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  const scope = await requireTenantScope();
  if (!scope.ok) return scope.response;

  try {
    const { slug } = await params;
    const parsed = z.object({ isAdvertised: z.boolean() }).safeParse(await req.json());
    if (!parsed.success) return badRequest(parsed.error.flatten());

    await connectDB();
    const product = await Product.findOneAndUpdate(
      { tenant: scope.tenantId, slug },
      { isAdvertised: parsed.data.isAdvertised },
      { new: true }
    );
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    return NextResponse.json({ ok: true, isAdvertised: product.isAdvertised });
  } catch (err) {
    return apiErrorResponse(err, "Failed to update product advertising.");
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const scope = await requireTenantScope();
  if (!scope.ok) return scope.response;

  try {
    const { slug } = await params;
    await connectDB();
    const res = await Product.deleteOne({ tenant: scope.tenantId, slug });
    if (!res.deletedCount) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err, "Failed to delete product.");
  }
}
