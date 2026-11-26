"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { readApiError } from "@/lib/readApiError";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export type TenantFormValues = {
  name: string;
  slug: string;
  domains: string;
  isActive: boolean;
  logoUrl: string;
  showNameWithLogo: boolean;
  primaryColor: string;
  accentColor: string;
  headingFont: "serif" | "sans";
  tagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutIntro: string;
  about: string;
  aboutImage: string;
  stats: { label: string; value: string }[];
  highlights: { title: string; desc: string }[];
  audiences: string;
  faqs: { q: string; a: string }[];
  distributorIntro: string;
  distributorBenefits: { title: string; desc: string }[];
  footerBlurb: string;
  location: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  currency: string;
  showPrices: boolean;
  enableDistributors: boolean;
  contactWhatsApp: string;
  contactPhone: string;
  contactEmail: string;
  metaTitle: string;
  metaDescription: string;
  facebookPixelBaseCode: string;
  facebookConversionCode: string;
};

const inputCls = "w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]";

function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[12px] font-semibold text-black/60">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint ? <span className="mt-1 block text-[11px] leading-4 text-black/45">{hint}</span> : null}
    </label>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5">
      <h2 className="text-[17px] font-semibold">{title}</h2>
      {desc ? <p className="mt-1 text-[13px] text-black/55">{desc}</p> : null}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 text-[13px] font-semibold">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      {label}
    </label>
  );
}

/** Edits a list of small records (stats, FAQs, highlights…). */
function RowsEditor<T extends Record<string, string>>({
  label,
  rows,
  onChange,
  fields,
  empty,
}: {
  label: string;
  rows: T[];
  onChange: (rows: T[]) => void;
  fields: { key: keyof T & string; placeholder: string; long?: boolean }[];
  empty: T;
}) {
  return (
    <div className="md:col-span-2">
      <div className="text-[12px] font-semibold text-black/60">{label}</div>
      <div className="mt-1.5 space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className={`grid flex-1 gap-2 ${fields.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {fields.map((f) =>
                f.long ? (
                  <textarea
                    key={f.key}
                    rows={2}
                    value={row[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => onChange(rows.map((r, j) => (j === i ? { ...r, [f.key]: e.target.value } : r)))}
                    className={inputCls}
                  />
                ) : (
                  <input
                    key={f.key}
                    value={row[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => onChange(rows.map((r, j) => (j === i ? { ...r, [f.key]: e.target.value } : r)))}
                    className={inputCls}
                  />
                )
              )}
            </div>
            <button
              type="button"
              onClick={() => onChange(rows.filter((_, j) => j !== i))}
              className="rounded-lg border border-black/10 px-2.5 py-2 text-[12px] font-semibold text-black/60 hover:bg-black/5"
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...rows, { ...empty }])}
          className="rounded-lg border border-dashed border-black/20 px-3 py-1.5 text-[12px] font-semibold text-black/60 hover:bg-black/5"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  clientId,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  clientId: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("clientId", clientId);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) throw new Error(data?.error || "Upload failed.");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="text-[12px] font-semibold text-black/60">{label}</div>
      <div className="mt-1.5 flex items-center gap-3">
        <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-black/[0.03]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : (
            <span className="text-[11px] text-black/40">None</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-black/10 px-3 py-1.5 text-[12px] font-semibold hover:bg-black/5 disabled:opacity-50"
            >
              {busy ? "Uploading…" : value ? "Replace" : "Upload"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg px-2 py-1.5 text-[12px] font-semibold text-black/50 hover:text-black"
              >
                Remove
              </button>
            ) : null}
          </div>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-56 rounded-lg border border-black/10 px-2 py-1 text-[11px]"
          />
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
      </div>
      {hint ? <span className="mt-1 block text-[11px] text-black/45">{hint}</span> : null}
      {error ? <p className="mt-1 text-[12px] font-semibold text-red-700">{error}</p> : null}
    </div>
  );
}

export function TenantForm({
  id,
  initial,
  rootDomain,
  previewUrl,
  leadDefaults,
}: {
  id: string;
  initial: TenantFormValues;
  rootDomain: string;
  previewUrl: string;
  leadDefaults: { whatsapp: string; phone: string; email: string };
}) {
  const router = useRouter();
  const [f, setF] = useState<TenantFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = <K extends keyof TenantFormValues>(key: K, value: TenantFormValues[K]) =>
    setF((s) => ({ ...s, [key]: value }));
  const text = (key: keyof TenantFormValues) => ({
    value: f[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value as never),
  });

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...f,
          domains: f.domains,
          audiences: f.audiences.split("\n").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) {
        setMessage({ ok: false, text: (await readApiError(res, "Failed to save.")) || "Server unavailable." });
        return;
      }
      setMessage({ ok: true, text: "Saved. Changes are live." });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/clients");
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  const domainList = f.domains.split(/[\s,]+/).filter(Boolean);

  return (
    <div className="space-y-5 pb-24">
      <Section title="Site address" desc="Where this client's site lives.">
        <Field label="Client name">
          <input {...text("name")} className={inputCls} />
        </Field>
        <Field label="Subdomain" hint={`${f.slug || "name"}.${rootDomain || "your-platform-domain"}`}>
          <input {...text("slug")} className={inputCls} />
        </Field>
        <Field
          label="Custom domains (one per line)"
          hint="e.g. acmepaints.com — www. is handled automatically."
          className="md:col-span-2"
        >
          <textarea {...text("domains")} rows={2} className={inputCls} placeholder="acmepaints.com" />
        </Field>
        {domainList.length ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12px] leading-5 text-amber-950 md:col-span-2">
            <div className="font-semibold">To connect {domainList.join(", ")}:</div>
            <ol className="mt-1 list-decimal space-y-0.5 pl-5">
              <li>In Vercel → your openCare project → Settings → Domains, add each domain (and its www. version).</li>
              <li>
                At the domain registrar, add an <b>A</b> record for <code>@</code> → <code>76.76.21.21</code> and a{" "}
                <b>CNAME</b> for <code>www</code> → <code>cname.vercel-dns.com</code>.
              </li>
              <li>Wait for Vercel to show &quot;Valid Configuration&quot;. HTTPS is issued automatically.</li>
            </ol>
          </div>
        ) : null}
        <div className="flex items-center gap-6 md:col-span-2">
          <Toggle checked={f.isActive} onChange={(v) => set("isActive", v)} label="Site is live" />
          <a href={previewUrl} target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-blue-700 hover:underline">
            Preview site ↗
          </a>
        </div>
      </Section>

      <Section title="Branding">
        <div className="space-y-2">
          <ImageField label="Logo" value={f.logoUrl} onChange={(v) => set("logoUrl", v)} clientId={id} hint="Also used as the browser tab icon." />
          <Toggle checked={f.showNameWithLogo} onChange={(v) => set("showNameWithLogo", v)} label="Show client name beside the logo (for icon logos)" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Main colour">
            <div className="flex items-center gap-2">
              <input type="color" value={f.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} className="h-9 w-12 rounded border border-black/10" />
              <input {...text("primaryColor")} className={inputCls} />
            </div>
          </Field>
          <Field label="Accent colour">
            <div className="flex items-center gap-2">
              <input type="color" value={f.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="h-9 w-12 rounded border border-black/10" />
              <input {...text("accentColor")} className={inputCls} />
            </div>
          </Field>
        </div>
        <Field label="Heading style">
          <select value={f.headingFont} onChange={(e) => set("headingFont", e.target.value as "serif" | "sans")} className={inputCls}>
            <option value="sans">Modern (sans-serif)</option>
            <option value="serif">Classic (serif)</option>
          </select>
        </Field>
        <Field label="Tagline" hint="One line about the client. Used in search results and the footer.">
          <input {...text("tagline")} className={inputCls} />
        </Field>
      </Section>

      <Section title="Home page">
        <Field label="Small heading above title" hint="e.g. Premium paints · Nigeria">
          <input {...text("heroEyebrow")} className={inputCls} />
        </Field>
        <Field label="Main title">
          <input {...text("heroTitle")} className={inputCls} />
        </Field>
        <Field label="Intro text" className="md:col-span-2">
          <textarea {...text("heroSubtitle")} rows={2} className={inputCls} />
        </Field>
        <ImageField label="Hero background image" value={f.heroImage} onChange={(v) => set("heroImage", v)} clientId={id} hint="Wide photo, at least 1600px. Leave empty for a colour gradient." />
        <RowsEditor
          label="Why choose us (shown on Home and About)"
          rows={f.highlights}
          onChange={(v) => set("highlights", v)}
          fields={[{ key: "title", placeholder: "Title" }, { key: "desc", placeholder: "Short description" }]}
          empty={{ title: "", desc: "" }}
        />
      </Section>

      <Section title="About page">
        <Field label="Title">
          <input {...text("aboutTitle")} className={inputCls} />
        </Field>
        <Field label="Intro">
          <input {...text("aboutIntro")} className={inputCls} />
        </Field>
        <Field label="About text" hint="Leave a blank line between paragraphs." className="md:col-span-2">
          <textarea {...text("about")} rows={6} className={inputCls} />
        </Field>
        <ImageField label="About page image" value={f.aboutImage} onChange={(v) => set("aboutImage", v)} clientId={id} />
        <Field label="Who you serve (one per line)">
          <textarea {...text("audiences")} rows={4} className={inputCls} placeholder={"Contractors\nRetail shops\nHomeowners"} />
        </Field>
        <RowsEditor
          label="Key numbers"
          rows={f.stats}
          onChange={(v) => set("stats", v)}
          fields={[{ key: "value", placeholder: "Value, e.g. 20+" }, { key: "label", placeholder: "Label, e.g. Years in business" }]}
          empty={{ value: "", label: "" }}
        />
        <RowsEditor
          label="FAQs"
          rows={f.faqs}
          onChange={(v) => set("faqs", v)}
          fields={[{ key: "q", placeholder: "Question" }, { key: "a", placeholder: "Answer", long: true }]}
          empty={{ q: "", a: "" }}
        />
      </Section>

      <Section title="Catalogue">
        <Field label="Currency" hint="3-letter code, e.g. NGN, USD, GHS">
          <input {...text("currency")} maxLength={3} className={inputCls} />
        </Field>
        <div className="flex flex-col justify-center gap-3">
          <Toggle checked={f.showPrices} onChange={(v) => set("showPrices", v)} label="Show prices on the site" />
          <Toggle checked={f.enableDistributors} onChange={(v) => set("enableDistributors", v)} label="Show 'Become a Distributor' page" />
        </div>
        {f.enableDistributors ? (
          <>
            <Field label="Distributor page intro" className="md:col-span-2">
              <textarea {...text("distributorIntro")} rows={2} className={inputCls} />
            </Field>
            <RowsEditor
              label="Distributor benefits"
              rows={f.distributorBenefits}
              onChange={(v) => set("distributorBenefits", v)}
              fields={[{ key: "title", placeholder: "Benefit" }, { key: "desc", placeholder: "Details" }]}
              empty={{ title: "", desc: "" }}
            />
          </>
        ) : null}
      </Section>

      <Section
        title="Contact & footer"
        desc="Leads always go to your openCare inbox. Contact fields left empty show your openCare contacts."
      >
        <Field label="WhatsApp shown on site" hint={`Empty = ${leadDefaults.whatsapp || "openCare WhatsApp"}`}>
          <input {...text("contactWhatsApp")} className={inputCls} />
        </Field>
        <Field label="Phone shown on site" hint={`Empty = ${leadDefaults.phone || "openCare phone"}`}>
          <input {...text("contactPhone")} className={inputCls} />
        </Field>
        <Field label="Email shown on site" hint={`Empty = ${leadDefaults.email || "openCare email"}`}>
          <input {...text("contactEmail")} className={inputCls} />
        </Field>
        <Field label="Location" hint="e.g. Lagos, Nigeria">
          <input {...text("location")} className={inputCls} />
        </Field>
        <Field label="Footer text" className="md:col-span-2">
          <textarea {...text("footerBlurb")} rows={2} className={inputCls} />
        </Field>
        <Field label="Facebook URL"><input {...text("facebook")} className={inputCls} /></Field>
        <Field label="Instagram URL"><input {...text("instagram")} className={inputCls} /></Field>
        <Field label="X / Twitter URL"><input {...text("twitter")} className={inputCls} /></Field>
        <Field label="LinkedIn URL"><input {...text("linkedin")} className={inputCls} /></Field>
      </Section>

      <Section title="Search & ads tracking">
        <Field label="Page title for Google" hint="Defaults to the client name.">
          <input {...text("metaTitle")} className={inputCls} />
        </Field>
        <Field label="Description for Google" hint="Defaults to the tagline.">
          <input {...text("metaDescription")} className={inputCls} />
        </Field>
        <Field label="Facebook Pixel — base code or Pixel ID" className="md:col-span-2">
          <textarea {...text("facebookPixelBaseCode")} rows={4} className={`${inputCls} font-mono text-[12px]`} />
        </Field>
        <Field label="Facebook Pixel — conversion event code (optional)" className="md:col-span-2">
          <textarea {...text("facebookConversionCode")} rows={3} className={`${inputCls} font-mono text-[12px]`} />
        </Field>
      </Section>

      <section className="rounded-2xl border border-red-200 bg-white p-5">
        <h2 className="text-[17px] font-semibold text-red-800">Delete client</h2>
        <p className="mt-1 text-[13px] text-black/60">
          Removes the site, products, brands and categories. Leads stay in your inbox.
        </p>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="mt-3 rounded-xl border border-red-300 px-4 py-2 text-[13px] font-semibold text-red-700 hover:bg-red-50"
        >
          Delete {initial.name}
        </button>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className={`text-[13px] font-semibold ${message?.ok === false ? "text-red-700" : "text-emerald-700"}`}>
            {message?.text}
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-black px-6 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${initial.name}?`}
        message="This permanently removes the client's site and catalogue. This cannot be undone."
        confirmLabel="Delete client"
        loading={deleting}
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
