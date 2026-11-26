import Link from "next/link";
import { getAdminTenants, getLeadCounts } from "@/lib/adminQueries";
import { CreateClientForm } from "@/components/admin/CreateClientForm";
import { platformRootDomain } from "@/lib/hosts";
import { clientSiteUrl } from "@/lib/clientUrls";
import { ClientImportButtons } from "@/components/admin/ClientImportButtons";
import { CLIENT_IMPORTS } from "@/lib/clientImports";

export default async function AdminClientsPage() {
  const [clients, leadCounts] = await Promise.all([getAdminTenants(), getLeadCounts()]);
  const root = platformRootDomain();

  return (
    <div>
      <h1 className="text-[30px] font-semibold">Clients</h1>
      <p className="mt-2 text-[14px] text-black/65">
        Each client gets its own catalogue and lead site, on a subdomain or on its own domain.
      </p>

      <div className="mt-6">
        <ClientImportButtons
          options={Object.entries(CLIENT_IMPORTS).map(([key, def]) => ({
            key,
            label: def.label,
            products: def.products,
            exists: clients.some((c) => c.slug === key),
          }))}
        />
      </div>

      <div className="mt-4">
        <CreateClientForm rootDomain={root} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <table className="min-w-full text-left text-[13px]">
          <thead className="border-b border-black/10 bg-black/[0.02] text-[12px] uppercase tracking-[0.06em] text-black/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Site</th>
              <th className="px-4 py-3 font-semibold">Products</th>
              <th className="px-4 py-3 font-semibold">Leads</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-black/55">
                  No clients yet. Add your first one above.
                </td>
              </tr>
            ) : (
              clients.map((c) => {
                const leads = leadCounts[c._id];
                const url = clientSiteUrl(c);
                return (
                  <tr key={c._id} className="border-b border-black/5 last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-3 w-3 rounded-full" style={{ background: c.primaryColor }} />
                        <span className="font-semibold">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-black/70">
                      <a href={url} target="_blank" rel="noreferrer" className="underline decoration-black/20 hover:text-black">
                        {url.replace(/^https?:\/\//, "")}
                      </a>
                      {c.domains.length > 1 ? <span className="text-black/40"> +{c.domains.length - 1}</span> : null}
                    </td>
                    <td className="px-4 py-3 text-black/70">{c.products}</td>
                    <td className="px-4 py-3 text-black/70">
                      {leads ? (
                        <Link href={`/admin/dashboard?client=${c._id}`} className="hover:underline">
                          {leads.total}
                          {leads.new ? <span className="ml-1.5 font-semibold text-emerald-700">({leads.new} new)</span> : null}
                        </Link>
                      ) : (
                        0
                      )}
                    </td>
                    <td className="px-4 py-3 text-black/70">{c.isActive ? "Live" : "Hidden"}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/clients/${c._id}`} className="rounded-lg border border-black/10 px-3 py-1.5 text-[12px] font-semibold hover:bg-black/5">
                        Edit site
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
