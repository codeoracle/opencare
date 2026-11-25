import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { badRequest, isDuplicateKeyError, requireSession, unauthorized } from "@/lib/adminApi";
import { Tenant } from "@/models/Tenant";
import { Product } from "@/models/Product";
import { Brand } from "@/models/Brand";
import { Category } from "@/models/Category";
import { invalidateTenantCache } from "@/lib/tenant";
import { tenantSchema, toTenantFields } from "@/lib/tenantInput";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await requireSession())) return unauthorized();

  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return badRequest("Invalid client id.");
    const parsed = tenantSchema.safeParse(await req.json());
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return badRequest(issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid input.");
    }

    await connectDB();
    const tenant = await Tenant.findByIdAndUpdate(id, toTenantFields(parsed.data), {
      new: true,
      runValidators: true,
    });
    if (!tenant) return NextResponse.json({ error: "Client not found." }, { status: 404 });
    invalidateTenantCache();
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return NextResponse.json({ error: "That subdomain or domain is already used by another client." }, { status: 409 });
    }
    return apiErrorResponse(err, "Failed to save client.");
  }
}

/** Deletes the client and its catalogue. Leads are kept for your records. */
export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await requireSession())) return unauthorized();

  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return badRequest("Invalid client id.");
    await connectDB();
    const tenant = await Tenant.findById(id);
    if (!tenant) return NextResponse.json({ error: "Client not found." }, { status: 404 });
    await Promise.all([
      Product.deleteMany({ tenant: tenant._id }),
      Brand.deleteMany({ tenant: tenant._id }),
      Category.deleteMany({ tenant: tenant._id }),
    ]);
    await tenant.deleteOne();
    invalidateTenantCache();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err, "Failed to delete client.");
  }
}
