import { Types } from "mongoose";
import { Product, type IProduct } from "@/models/Product";
import { Brand } from "@/models/Brand";
import { Category } from "@/models/Category";
import { connectDB } from "@/lib/db";
import { asId, serializeNamedRef, serializeSpecs, serializeStringList } from "@/lib/serialize";
import type { NamedRef, ProductCard, ProductDetail } from "@/types/catalog";

/** Every public catalogue query is scoped to one client. */
type TenantId = string;

type PopulatedProduct = IProduct & {
  _id: unknown;
  brand?: { _id?: unknown; name?: string; slug?: string } | null;
  category?: { _id?: unknown; name?: string; slug?: string } | null;
};

function tid(tenantId: TenantId) {
  return new Types.ObjectId(tenantId);
}

function mapCard(p: PopulatedProduct): ProductCard {
  return {
    _id: asId(p._id),
    name: p.name,
    slug: p.slug,
    price: p.price ?? undefined,
    images: p.images ? [...p.images] : [],
    shortDescription: p.shortDescription,
    isFeatured: p.isFeatured,
    brand: serializeNamedRef(p.brand),
    category: serializeNamedRef(p.category),
  };
}

async function namedRefs(model: typeof Brand | typeof Category, tenantId: TenantId): Promise<NamedRef[]> {
  await connectDB();
  const rows = await (model as typeof Brand)
    .find({ tenant: tid(tenantId), isActive: true })
    .select("name slug")
    .sort({ name: 1 })
    .lean();
  return rows.map((r) => ({ _id: asId(r._id), name: r.name, slug: r.slug }));
}

export function getBrands(tenantId: TenantId) {
  return namedRefs(Brand, tenantId);
}

export function getCategories(tenantId: TenantId) {
  return namedRefs(Category, tenantId);
}

export async function getProducts(
  tenantId: TenantId,
  input: { featuredOnly?: boolean; limit?: number } = {}
): Promise<ProductCard[]> {
  await connectDB();
  const filter: Record<string, unknown> = { tenant: tid(tenantId), isActive: true };
  if (input.featuredOnly) filter.isFeatured = true;

  const rows = await Product.find(filter)
    .populate("brand", "name slug")
    .populate("category", "name slug")
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(input.limit ?? 200)
    .lean<PopulatedProduct[]>();

  return rows.map(mapCard);
}

export async function getProductBySlug(tenantId: TenantId, slug: string): Promise<ProductDetail | null> {
  await connectDB();
  const p = await Product.findOne({ tenant: tid(tenantId), slug, isActive: true })
    .populate("brand", "name slug")
    .populate("category", "name slug")
    .lean<PopulatedProduct>();
  if (!p) return null;

  return {
    ...mapCard(p),
    description: p.description,
    compareAtPrice: p.compareAtPrice ?? undefined,
    specs: serializeSpecs(p.specs),
    features: serializeStringList(p.features),
    isAdvertised: p.isAdvertised ?? false,
  };
}
