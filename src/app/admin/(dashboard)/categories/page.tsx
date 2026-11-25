import { getAdminCategories } from "@/lib/adminQueries";
import { getActiveTenant } from "@/lib/adminTenant";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { NoClientYet } from "@/components/admin/NoClientYet";
import { asId } from "@/lib/serialize";

export default async function AdminCategoriesPage() {
  const active = await getActiveTenant();
  if (!active) return <NoClientYet />;

  const categories = (await getAdminCategories(active._id)).map((c) => ({
    _id: asId(c._id),
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    isActive: c.isActive,
  }));

  return (
    <div>
      <h1 className="text-[30px] font-semibold">Categories · {active.name}</h1>
      <p className="mt-2 text-[14px] text-black/65">Group this client&apos;s products so visitors can filter them.</p>
      <div className="mt-6">
        <CategoryManager key={active._id} categories={categories} />
      </div>
    </div>
  );
}
