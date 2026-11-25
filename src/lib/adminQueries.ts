import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Brand } from "@/models/Brand";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { Lead, type LeadStatus, type LeadType } from "@/models/Lead";
import { Tenant, type ITenant } from "@/models/Tenant";
import { asId } from "@/lib/serialize";

function tid(id: string) {
  return new Types.ObjectId(id);
}

export async function getAdminBrands(tenantId: string) {
  await connectDB();
  return Brand.find({ tenant: tid(tenantId) }).sort({ createdAt: -1 }).lean();
}

export async function getAdminCategories(tenantId: string) {
  await connectDB();
  return Category.find({ tenant: tid(tenantId) }).sort({ createdAt: -1 }).lean();
}

export async function getAdminProducts(tenantId: string) {
  await connectDB();
  return Product.find({ tenant: tid(tenantId) })
    .populate("brand", "name slug")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();
}

export type AdminLead = {
  _id: string;
  tenantId: string;
  tenantName: string;
  type: LeadType;
  status: LeadStatus;
  notes: string;
  name: string;
  email: string;
  phone: string;
  productName: string;
  quantity: number | null;
  deliveryAddress: string;
  message: string;
  businessName: string;
  location: string;
  subject: string;
  createdAt: string;
};

export async function getAdminLeads(filter: { tenantId?: string; type?: string; status?: string }) {
  await connectDB();
  const q: Record<string, unknown> = {};
  if (filter.tenantId && Types.ObjectId.isValid(filter.tenantId)) q.tenant = tid(filter.tenantId);
  if (filter.type) q.type = filter.type;
  if (filter.status) q.status = filter.status;

  const rows = await Lead.find(q).sort({ createdAt: -1 }).limit(300).lean();
  return rows.map(
    (l): AdminLead => ({
      _id: asId(l._id),
      tenantId: asId(l.tenant),
      tenantName: l.tenantName,
      type: l.type,
      status: l.status,
      notes: l.notes || "",
      name: l.name,
      email: l.email,
      phone: l.phone || "",
      productName: l.productName || "",
      quantity: l.quantity ?? null,
      deliveryAddress: l.deliveryAddress || "",
      message: l.message || "",
      businessName: l.businessName || "",
      location: [l.city, l.state].filter(Boolean).join(", "),
      subject: l.subject || "",
      createdAt: new Date(l.createdAt).toISOString(),
    })
  );
}

export async function getLeadCounts() {
  await connectDB();
  const rows = await Lead.aggregate<{ _id: { tenant: Types.ObjectId; status: LeadStatus }; n: number }>([
    { $group: { _id: { tenant: "$tenant", status: "$status" }, n: { $sum: 1 } } },
  ]);
  const byTenant: Record<string, { total: number; new: number }> = {};
  for (const r of rows) {
    const key = String(r._id.tenant);
    byTenant[key] ??= { total: 0, new: 0 };
    byTenant[key].total += r.n;
    if (r._id.status === "new") byTenant[key].new += r.n;
  }
  return byTenant;
}

export async function getAdminTenants() {
  await connectDB();
  const [tenants, productCounts] = await Promise.all([
    Tenant.find({}).sort({ name: 1 }).lean<ITenant[]>(),
    Product.aggregate<{ _id: Types.ObjectId; n: number }>([{ $group: { _id: "$tenant", n: { $sum: 1 } } }]),
  ]);
  const counts = new Map(productCounts.map((c) => [String(c._id), c.n]));
  return tenants.map((t) => ({
    _id: String(t._id),
    name: t.name,
    slug: t.slug,
    domains: t.domains || [],
    isActive: t.isActive,
    logoUrl: t.logoUrl || "",
    primaryColor: t.primaryColor,
    products: counts.get(String(t._id)) ?? 0,
  }));
}

export async function getAdminTenant(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  await connectDB();
  return Tenant.findById(id).lean<ITenant>();
}
