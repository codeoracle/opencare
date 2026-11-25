import { NextResponse } from "next/server";
import { z } from "zod";
import type { Model } from "mongoose";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { createSlug } from "@/lib/utils";
import { badRequest, isDuplicateKeyError, requireTenantScope } from "@/lib/adminApi";
import { Product } from "@/models/Product";

/**
 * Brands and categories behave the same: tenant-scoped name/slug records that
 * products point at. This builds their admin route handlers.
 */
export function namedRefRoutes(opts: {
  model: Model<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  label: "brand" | "category";
  imageField: "logo" | "image";
}) {
  const { model, label, imageField } = opts;
  const schema = z.object({
    name: z.string().trim().min(2),
    description: z.string().optional(),
    [imageField]: z.string().optional(),
    isActive: z.boolean().optional(),
  });
  const productField = label === "brand" ? "brand" : "category";
  const duplicate = () =>
    NextResponse.json({ error: `A ${label} with that name already exists for this client.` }, { status: 409 });

  async function POST(req: Request) {
    const scope = await requireTenantScope();
    if (!scope.ok) return scope.response;
    try {
      const parsed = schema.safeParse(await req.json());
      if (!parsed.success) return badRequest(parsed.error.flatten());
      await connectDB();
      const data = parsed.data as Record<string, unknown> & { name: string };
      const doc = await model.create({
        tenant: scope.tenantId,
        name: data.name,
        slug: createSlug(data.name),
        description: data.description,
        [imageField]: data[imageField],
        isActive: data.isActive ?? true,
      });
      return NextResponse.json({ ok: true, [label]: doc });
    } catch (err) {
      if (isDuplicateKeyError(err)) return duplicate();
      return apiErrorResponse(err, `Failed to create ${label}.`);
    }
  }

  async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const scope = await requireTenantScope();
    if (!scope.ok) return scope.response;
    try {
      const { slug } = await params;
      const parsed = schema.safeParse(await req.json());
      if (!parsed.success) return badRequest(parsed.error.flatten());
      await connectDB();
      const doc = await model.findOne({ tenant: scope.tenantId, slug });
      if (!doc) return NextResponse.json({ error: `${label} not found.` }, { status: 404 });
      const data = parsed.data as Record<string, unknown> & { name: string };
      doc.name = data.name;
      doc.slug = createSlug(data.name);
      doc.description = data.description;
      doc[imageField] = data[imageField];
      doc.isActive = data.isActive ?? true;
      await doc.save();
      return NextResponse.json({ ok: true, [label]: doc });
    } catch (err) {
      if (isDuplicateKeyError(err)) return duplicate();
      return apiErrorResponse(err, `Failed to update ${label}.`);
    }
  }

  async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const scope = await requireTenantScope();
    if (!scope.ok) return scope.response;
    try {
      const { slug } = await params;
      await connectDB();
      const doc = await model.findOne({ tenant: scope.tenantId, slug });
      if (!doc) return NextResponse.json({ error: `${label} not found.` }, { status: 404 });
      // Detach products rather than leaving dangling references.
      await Product.updateMany(
        { tenant: scope.tenantId, [productField]: doc._id },
        { $unset: { [productField]: 1 } }
      );
      await doc.deleteOne();
      return NextResponse.json({ ok: true });
    } catch (err) {
      return apiErrorResponse(err, `Failed to delete ${label}.`);
    }
  }

  return { POST, PUT, DELETE };
}
