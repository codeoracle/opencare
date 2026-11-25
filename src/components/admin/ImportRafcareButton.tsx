"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ImportRafcareButton({ exists }: { exists: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function run() {
    setState("busy");
    const res = await fetch("/api/admin/import/rafcare", { method: "POST" });
    const data = await res.json().catch(() => null);
    if (res.ok) {
      setState("done");
      setMsg(`Imported ${data.products} products in ${data.categories} categories.`);
      router.refresh();
    } else {
      setState("error");
      setMsg(data?.error || "Import failed.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px]">
      <span className="font-semibold text-emerald-950">
        {exists ? "RAFCARE catalogue" : "RAFCARE isn't set up on this database yet."}
      </span>
      <button
        type="button"
        onClick={run}
        disabled={state === "busy"}
        className="rounded-lg bg-emerald-800 px-3 py-1.5 font-semibold text-white disabled:opacity-60"
      >
        {state === "busy" ? "Importing…" : exists ? "Re-import RAFCARE catalogue" : "Import RAFCARE (68 products)"}
      </button>
      {msg ? <span className={state === "error" ? "text-red-700" : "text-emerald-900"}>{msg}</span> : null}
    </div>
  );
}
