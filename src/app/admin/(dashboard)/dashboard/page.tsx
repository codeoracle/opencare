import { Suspense } from "react";
import { getAdminLeads } from "@/lib/adminQueries";
import { listTenantRefs } from "@/lib/adminTenant";
import { LeadInbox } from "@/components/admin/LeadInbox";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const pick = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");

  const [leads, clients] = await Promise.all([
    getAdminLeads({ tenantId: pick("client"), type: pick("type"), status: pick("status") }),
    listTenantRefs(),
  ]);
  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <div>
      <h1 className="text-[30px] font-semibold">Leads</h1>
      <p className="mt-2 text-[14px] text-black/65">
        Every enquiry, distributor application and contact message from all client sites.
        {newCount ? ` ${newCount} new.` : ""} Click a lead to update its status or copy it to forward.
      </p>
      <div className="mt-6">
        <Suspense>
          <LeadInbox leads={leads} clients={clients} />
        </Suspense>
      </div>
    </div>
  );
}
