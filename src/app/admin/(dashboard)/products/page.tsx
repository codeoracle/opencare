import { ProductManager } from "@/components/admin/ProductManager";
import { NoClientYet } from "@/components/admin/NoClientYet";
import { getAdminBrands, getAdminCategories, getAdminProducts } from "@/lib/adminQueries";
import { getActiveTenant } from "@/lib/adminTenant";
import { getAdminTenant } from "@/lib/adminQueries";
import { asId, serializeNamedRef, serializeSpecs, serializeStringList } from "@/lib/serialize";

export default async function AdminProductsPage() {
  const active = await getActiveTenant();
  if (!active) return <NoClientYet />;

  const [productsRaw, brandsRaw, categoriesRaw, tenant] = await Promise.all([
    getAdminProducts(active._id),
    getAdminBrands(active._id),
    getAdminCategories(active._id),
    getAdminTenant(active._id),
  ]);

  const brands = brandsRaw.map((b) => ({ _id: asId(b._id), name: b.name, slug: b.slug }));
  const categories = categoriesRaw.map((c) => ({ _id: asId(c._id), name: c.name, slug: c.slug }));
  const products = productsRaw.map((p) => ({
    _id: asId(p._id),
    name: p.name,
    slug: p.slug,
    description: p.description,
    shortDescription: p.shortDescription,
    price: p.price ?? undefined,
    compareAtPrice: p.compareAtPrice ?? undefined,
    images: p.images ? [...p.images] : [],
    stock: p.stock,
    isFeatured: p.isFeatured,
    isAdvertised: Boolean(p.isAdvertised),
    isActive: p.isActive,
    features: serializeStringList(p.features),
    specs: serializeSpecs(p.specs),
    brand: serializeNamedRef(p.brand as never) ?? undefined,
    category: serializeNamedRef(p.category as never) ?? undefined,
  }));

  return (
    <div>
      <h1 className="text-[30px] font-semibold">Products · {active.name}</h1>
      <p className="mt-2 text-[14px] text-black/65">
        Create, edit and delete this client&apos;s products. Brand, category and price are optional.
      </p>
      <div className="mt-6">
        <ProductManager
          key={active._id}
          products={products}
          brands={brands}
          categories={categories}
          currency={tenant?.currency || "NGN"}
        />
      </div>
    </div>
  );
}
