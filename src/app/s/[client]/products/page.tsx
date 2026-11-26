import { notFound } from "next/navigation";
import { getBrands, getCategories, getProducts } from "@/lib/queries";
import { getCurrentTenant } from "@/lib/tenant";
import { ProductsCatalog } from "@/components/ProductsCatalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();

  const resolved = await searchParams;
  const pick = (key: string) => (typeof resolved?.[key] === "string" ? (resolved[key] as string) : "");

  const [brands, categories, products] = await Promise.all([
    getBrands(tenant.id),
    getCategories(tenant.id),
    getProducts(tenant.id),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-[32px] font-semibold">Products</h1>
      <p className="mt-2 text-[14px] text-black/65">Search and filter the {tenant.name} catalogue.</p>

      <div className="mt-7">
        <ProductsCatalog
          products={products}
          brands={brands}
          categories={categories}
          initialQ={pick("q")}
          initialBrand={pick("brand")}
          initialCategory={pick("category")}
          initialSort={pick("sort") || "featured"}
          display={{ currency: tenant.currency, showPrices: tenant.showPrices }}
        />
      </div>
    </div>
  );
}
