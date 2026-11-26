"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ImportOption = { key: string; label: string; products: number; exists: boolean };

function ImportRow({ option }: { option: ImportOption }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function run() {
    setState("busy");
    const res = await fetch(`/api/admin/import/${option.key}`, { method: "POST" });
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
    <div className="flex flex-wrap items-center gap-3 text-[13px]">
      <span className="min-w-[140px] font-semibold text-emerald-950">{option.label}</span>
      <button
        type="button"
        onClick={run}
        disabled={state === "busy"}
        className="rounded-lg bg-emerald-800 px-3 py-1.5 font-semibold text-white disabled:opacity-60"
      >
        {state === "busy"
          ? "Importing…"
          : option.exists
            ? "Re-import catalogue"
            : `Import ${option.label} (${option.products} products)`}
      </button>
      {msg ? <span className={state === "error" ? "text-red-700" : "text-emerald-900"}>{msg}</span> : null}
    </div>
  );
}

/** Ready-made client catalogues; importing again updates in place without duplicates. */
export function ClientImportButtons({ options }: { options: ImportOption[] }) {
  return (
    <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
      <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-emerald-900/70">Ready-made catalogues</div>
      {options.map((o) => (
        <ImportRow key={o.key} option={o} />
      ))}
    </div>
  );
}
