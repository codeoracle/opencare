/**
 * Shared importer for client catalogues. Each client file supplies its site
 * settings and a catalogue; this creates or updates the client, its categories
 * and products, matching everything by slug so re-running never duplicates.
 */
import { connectDB } from "@/lib/db";
import { Tenant, type ITenant } from "@/models/Tenant";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { createSlug } from "@/lib/utils";
import { invalidateTenantCache } from "@/lib/tenant";

export type CatalogItem = {
  name: string;
  ingredients: string[];
  benefits: string[];
  use?: string;
  size?: string;
  featured?: boolean;
  /** Extra sentence for the product description (e.g. skin type, how to use). */
  note?: string;
};

export type Catalog = Record<string, { desc: string; use?: string; items: CatalogItem[] }>;

export type ClientImport = {
  /** Slugs to match, first = the slug the client ends up with (later ones get renamed). */
  slugs: string[];
  /** Brand name used in product descriptions. */
  brand: string;
  tenant: Partial<ITenant> & { name: string };
  catalog: Catalog;
  /** Image URLs for a product slug (first = main photo). */
  images: (slug: string) => string[];
};

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function list(xs: string[]) {
  return xs.length > 1 ? `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}` : xs[0] ?? "";
}

function describe(brand: string, item: CatalogItem) {
  const ingredients = item.ingredients.length ? ` is formulated with ${list(item.ingredients)}.` : ".";
  const benefits = item.benefits.length
    ? ` ${list(item.benefits.map(lowerFirst)).replace(/^./, (c) => c.toUpperCase())}.`
    : "";
  const note = item.note ? ` ${item.note}` : "";
  return (
    `${brand} ${item.name}${ingredients}${benefits}${note}\n\n` +
    "Available for retail and wholesale orders. Send an enquiry or message us on WhatsApp for pricing, " +
    "minimum order quantities and delivery."
  );
}

export async function runClientImport(def: ClientImport) {
  await connectDB();
  await Promise.all([Tenant.syncIndexes(), Category.syncIndexes(), Product.syncIndexes()]);

  const tenant = await Tenant.findOneAndUpdate(
    { slug: { $in: def.slugs } },
    { $set: { ...def.tenant, slug: def.slugs[0], isActive: true }, $setOnInsert: { domains: [] } },
    { upsert: true, new: true }
  );

  let count = 0;
  for (const [catName, { desc, use, items }] of Object.entries(def.catalog)) {
    const catSlug = createSlug(catName);
    const category = await Category.findOneAndUpdate(
      { tenant: tenant._id, slug: catSlug },
      { $set: { tenant: tenant._id, name: catName, slug: catSlug, description: desc, isActive: true } },
      { upsert: true, new: true }
    );

    for (const item of items) {
      const slug = createSlug(item.name);
      const specs = [
        ...(item.ingredients.length ? [{ label: "Key ingredients", value: item.ingredients.join(", ") }] : []),
        { label: "Use on", value: item.use || use || "Face" },
        ...(item.size ? [{ label: "Size", value: item.size }] : []),
      ];
      await Product.findOneAndUpdate(
        { tenant: tenant._id, slug },
        {
          $set: {
            tenant: tenant._id,
            name: item.name,
            slug,
            category: category._id,
            shortDescription: item.benefits.join(" · "),
            description: describe(def.brand, item),
            specs,
            features: item.benefits,
            images: def.images(slug),
            isFeatured: !!item.featured,
            isActive: true,
          },
          $setOnInsert: { stock: 0, isAdvertised: false },
        },
        { upsert: true }
      );
      count++;
    }
  }

  const missingPhotos = await Product.countDocuments({ tenant: tenant._id, images: { $size: 0 } });
  invalidateTenantCache();
  return {
    tenantId: String(tenant._id),
    products: count,
    categories: Object.keys(def.catalog).length,
    missingPhotos,
  };
}
