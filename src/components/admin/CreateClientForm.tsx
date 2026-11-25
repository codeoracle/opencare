"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { readApiError } from "@/lib/readApiError";

const inputCls = "w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
}

export function CreateClientForm({ rootDomain }: { rootDomain: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const effectiveSlug = slugTouched ? slug : toSlug(name);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug: effectiveSlug, domains: domain }),
      });
      if (!res.ok) {
        setError((await readApiError(res, "Failed to create client.")) || "Failed to create client.");
        return;
      }
      const data = await res.json();
      router.push(`/admin/clients/${data.id}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-black/10 bg-white p-5">
      <h2 className="text-[18px] font-semibold">Add a client</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-[12px] font-semibold text-black/60">Client / manufacturer name</span>
          <input
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Paints Ltd"
            className={`mt-1.5 ${inputCls}`}
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-black/60">Subdomain</span>
          <input
            required
            value={effectiveSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(toSlug(e.target.value));
            }}
            placeholder="acme-paints"
            className={`mt-1.5 ${inputCls}`}
          />
          <span className="mt-1 block text-[11px] text-black/45">
            {effectiveSlug || "name"}.{rootDomain || "your-platform-domain"}
          </span>
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-black/60">Custom domain (optional)</span>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="acmepaints.com"
            className={`mt-1.5 ${inputCls}`}
          />
          <span className="mt-1 block text-[11px] text-black/45">You can add or change this later.</span>
        </label>
      </div>
      {error ? <p className="mt-3 text-[13px] font-semibold text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={saving || name.trim().length < 2}
        className="mt-4 rounded-xl bg-black px-5 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50"
      >
        {saving ? "Creating…" : "Create client"}
      </button>
    </form>
  );
}
