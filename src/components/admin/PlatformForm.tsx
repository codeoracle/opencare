"use client";

import { useState } from "react";
import { readApiError } from "@/lib/readApiError";
import type { PlatformSettings } from "@/lib/platform";

const inputCls = "mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]";

export function PlatformForm({ initial }: { initial: PlatformSettings }) {
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/platform", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      setMessage(
        res.ok
          ? { ok: true, text: "Saved." }
          : { ok: false, text: (await readApiError(res, "Failed to save.")) || "Server unavailable." }
      );
    } finally {
      setSaving(false);
    }
  }

  const field = (key: keyof PlatformSettings, label: string, hint?: string) => (
    <label className="block">
      <span className="text-[12px] font-semibold text-black/60">{label}</span>
      <input value={f[key]} onChange={(e) => setF((s) => ({ ...s, [key]: e.target.value }))} className={inputCls} />
      {hint ? <span className="mt-1 block text-[11px] text-black/45">{hint}</span> : null}
    </label>
  );

  return (
    <form onSubmit={save} className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {field("name", "Platform name")}
        {field("leadEmail", "Lead email", "Every new lead from every client is emailed here.")}
        {field("leadWhatsApp", "Lead WhatsApp", "Default WhatsApp button on all client sites.")}
        {field("leadPhone", "Phone shown on sites", "Defaults to the WhatsApp number.")}
      </div>
      {message ? (
        <p className={`mt-4 text-[13px] font-semibold ${message.ok ? "text-emerald-700" : "text-red-700"}`}>{message.text}</p>
      ) : null}
      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-xl bg-black px-5 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
