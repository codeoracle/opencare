import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getActiveTenant, listTenantRefs } from "@/lib/adminTenant";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { ClientSwitcher } from "@/components/admin/ClientSwitcher";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin/dashboard", label: "Leads" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [clients, active] = await Promise.all([listTenantRefs(), getActiveTenant()]);
  const platformName = process.env.PLATFORM_NAME || "openCare";

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <div className="text-[18px] font-semibold tracking-tight">{platformName} Admin</div>
            <div className="text-[12px] text-black/55">{session.email}</div>
          </div>
          <div className="flex items-center gap-4">
            <ClientSwitcher clients={clients} activeId={active?._id ?? null} />
            <AdminLogoutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 pb-3 text-[13px] font-semibold text-black/60">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap transition hover:text-black">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
