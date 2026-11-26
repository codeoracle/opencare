import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Tenant, type ITenant } from "@/models/Tenant";
import { Product } from "@/models/Product";
import { platformRootDomain } from "@/lib/hosts";

export type BrandCard = {
  slug: string;
  name: string;
  tagline: string;
  logoUrl: string;
  showNameWithLogo: boolean;
  primaryColor: string;
  accentColor: string;
  image: string;
  /** True when image is a product shot (show whole), false for a banner photo (fill). */
  imageIsProduct: boolean;
  products: number;
  categories: string[];
  href: string;
};

/** Where a visitor on the openCare site goes to see a brand. */
export function brandHref(t: { slug: string; domains?: string[] }) {
  if (t.domains?.length) return `https://${t.domains[0]}`;
  const root = platformRootDomain();
  if (root) return `https://${t.slug}.${root}`;
  return `/${t.slug}`;
}

/** Live client brands for the public openCare directory. */
export async function getBrandCards(): Promise<BrandCard[]> {
  await connectDB();
  const tenants = await Tenant.find({ isActive: true }).sort({ createdAt: 1 }).lean<ITenant[]>();
  if (!tenants.length) return [];
  const ids = tenants.map((t) => t._id);

  const [counts, featured, cats] = await Promise.all([
    Product.aggregate<{ _id: Types.ObjectId; n: number }>([
      { $match: { tenant: { $in: ids }, isActive: true } },
      { $group: { _id: "$tenant", n: { $sum: 1 } } },
    ]),
    Product.aggregate<{ _id: Types.ObjectId; image: string }>([
      { $match: { tenant: { $in: ids }, isActive: true, "images.0": { $exists: true } } },
      { $sort: { isFeatured: -1, createdAt: 1 } },
      { $group: { _id: "$tenant", image: { $first: { $arrayElemAt: ["$images", 0] } } } },
    ]),
    Product.aggregate<{ _id: Types.ObjectId; names: string[] }>([
      { $match: { tenant: { $in: ids }, isActive: true, category: { $ne: null } } },
      { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "c" } },
      { $unwind: "$c" },
      { $group: { _id: "$tenant", names: { $addToSet: "$c.name" } } },
    ]),
  ]);
  const count = new Map(counts.map((c) => [String(c._id), c.n]));
  const image = new Map(featured.map((f) => [String(f._id), f.image]));
  const catMap = new Map(cats.map((c) => [String(c._id), c.names.sort()]));

  return tenants.map((t) => {
    const id = String(t._id);
    return {
      slug: t.slug,
      name: t.name,
      tagline: t.tagline || "",
      logoUrl: t.logoUrl || "",
      showNameWithLogo: !!t.showNameWithLogo,
      primaryColor: t.primaryColor || "#2563eb",
      accentColor: t.accentColor || "#f97316",
      image: t.heroImage || image.get(id) || "",
      imageIsProduct: !t.heroImage,
      products: count.get(id) ?? 0,
      categories: catMap.get(id) ?? [],
      href: brandHref(t),
    };
  });
}
