import { getAdminBrands } from "@/lib/adminQueries";
import { getActiveTenant } from "@/lib/adminTenant";
import { BrandManager } from "@/components/admin/BrandManager";
import { NoClientYet } from "@/components/admin/NoClientYet";
import { asId } from "@/lib/serialize";

export default async function AdminBrandsPage() {
  const active = await getActiveTenant();
  if (!active) return <NoClientYet />;

  const brands = (await getAdminBrands(active._id)).map((b) => ({
    _id: asId(b._id),
    name: b.name,
    slug: b.slug,
    description: b.description,
    logo: b.logo,
    isActive: b.isActive,
  }));

  return (
    <div>
      <h1 className="text-[30px] font-semibold">Brands · {active.name}</h1>
      <p className="mt-2 text-[14px] text-black/65">
        Optional. Use brands when this client sells more than one product line.
      </p>
      <div className="mt-6">
        <BrandManager key={active._id} brands={brands} />
      </div>
    </div>
  );
}
