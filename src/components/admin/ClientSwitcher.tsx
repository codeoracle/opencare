"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Ref = { _id: string; name: string };

/** Picks which client the catalogue screens (products, brands, categories) edit. */
export function ClientSwitcher({ clients, activeId }: { clients: Ref[]; activeId: string | null }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  if (!clients.length) return null;

  async function onChange(id: string) {
    setPending(true);
    try {
      await fetch("/api/admin/active-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: id }),
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <label className="flex items-center gap-2 text-[12px] font-semibold text-black/55">
      Client
      <select
        value={activeId ?? ""}
        disabled={pending}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[220px] rounded-lg border border-black/15 bg-white px-2.5 py-1.5 text-[13px] font-semibold text-black disabled:opacity-60"
      >
        {clients.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
