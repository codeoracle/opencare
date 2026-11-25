"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Switch the admin to this client, then open its product list. */
export function ActivateClientLink({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    await fetch("/api/admin/active-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId: id }),
    });
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={go}
      disabled={busy}
      className="rounded-xl bg-black px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
    >
      {busy ? "Opening…" : "Manage products →"}
    </button>
  );
}
