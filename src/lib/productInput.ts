import { z } from "zod";
import { Types } from "mongoose";
import { Brand } from "@/models/Brand";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { createSlug } from "@/lib/utils";

const optionalNumber = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : v),
  z.coerce.number().min(0).optional()
);

const optionalId = z.preprocess((v) => (v === "" || v === null ? undefined : v), z.string().optional());

export const productSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(5),
  shortDescription: z.string().optional(),
  price: optionalNumber,
  compareAtPrice: optionalNumber,
  images: z.array(z.string()).optional(),
  brandId: optionalId,
  categoryId: optionalId,
  specs: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).optional(),
  features: z.array(z.string()).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isAdvertised: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

/** Make sure a brand/category id exists AND belongs to this client. */
async function ownedRef(model: typeof Brand | typeof Category, tenant: Types.ObjectId, id?: string) {
  if (!id) return undefined;
  if (!Types.ObjectId.isValid(id)) throw new InputError("Invalid brand or category.");
  const found = await (model as typeof Brand).exists({ _id: id, tenant });
  if (!found) throw new InputError("Brand or category does not belong to this client.");
  return new Types.ObjectId(id);
}

export class InputError extends Error {}

/** A slug unique within the client: "paint", "paint-2", "paint-3"… */
export async function uniqueProductSlug(tenant: Types.ObjectId, name: string, excludeId?: unknown) {
  const base = createSlug(name) || "product";
  let slug = base;
  for (let i = 2; ; i++) {
    const clash = await Product.exists({
      tenant,
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    if (!clash) return slug;
    slug = `${base}-${i}`;
  }
}

export async function toProductFields(tenant: Types.ObjectId, data: ProductInput) {
  const [brand, category] = await Promise.all([
    ownedRef(Brand, tenant, data.brandId),
    ownedRef(Category, tenant, data.categoryId),
  ]);
  return {
    name: data.name,
    description: data.description,
    shortDescription: data.shortDescription || undefined,
    price: data.price,
    compareAtPrice: data.compareAtPrice,
    images: (data.images ?? []).map((s) => s.trim()).filter(Boolean),
    brand,
    category,
    specs: data.specs ?? [],
    features: (data.features ?? []).map((s) => s.trim()).filter(Boolean),
    stock: data.stock ?? 0,
    isFeatured: data.isFeatured ?? false,
    isActive: data.isActive ?? true,
    isAdvertised: data.isAdvertised ?? false,
  };
}
