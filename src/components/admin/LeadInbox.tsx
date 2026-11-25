"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { AdminLead } from "@/lib/adminQueries";
import { whatsappLink } from "@/lib/utils";

const STATUSES = ["new", "contacted", "forwarded", "closed"] as const;
const TYPE_LABEL: Record<AdminLead["type"], string> = {
  enquiry: "Enquiry",
  distributor: "Distributor",
  contact: "Message",
};
const STATUS_STYLE: Record<string, string> = {
  new: "bg-emerald-50 text-emerald-800 border-emerald-200",
  contacted: "bg-blue-50 text-blue-800 border-blue-200",
  forwarded: "bg-violet-50 text-violet-800 border-violet-200",
  closed: "bg-black/[0.03] text-black/50 border-black/10",
};

function headline(l: AdminLead) {
  if (l.type === "enquiry") return `${l.productName}${l.quantity ? ` × ${l.quantity}` : ""}`;
  if (l.type === "distributor") return l.businessName;
  return l.subject;
}

function forwardText(l: AdminLead) {
  return [
    `New ${TYPE_LABEL[l.type].toLowerCase()} for ${l.tenantName}`,
    l.productName && `Product: ${l.productName}${l.quantity ? ` × ${l.quantity}` : ""}`,
    l.businessName && `Business: ${l.businessName}`,
    l.subject && `Subject: ${l.subject}`,
    `Name: ${l.name}`,
    l.phone && `Phone: ${l.phone}`,
    `Email: ${l.email}`,
    l.location && `Location: ${l.location}`,
    l.deliveryAddress && `Delivery: ${l.deliveryAddress}`,
    l.message && `Message: ${l.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function LeadRow({ lead }: { lead: AdminLead }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  async function patch(body: Record<string, string>) {
    setSaving(true);
    try {
      await fetch(`/api/admin/leads/${lead._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const date = new Date(lead.createdAt);

  return (
    <div className="border-b border-black/5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid w-full grid-cols-12 items-center gap-3 px-4 py-3 text-left text-[13px] hover:bg-black/[0.015]"
      >
        <span className="col-span-2 text-black/50">
          {date.toLocaleDateString("en-NG", { day: "numeric", month: "short" })}{" "}
          <span className="text-black/35">{date.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}</span>
        </span>
        <span className="col-span-2 truncate font-semibold">{lead.tenantName}</span>
        <span className="col-span-1 text-black/60">{TYPE_LABEL[lead.type]}</span>
        <span className="col-span-3 truncate">{headline(lead)}</span>
        <span className="col-span-2 truncate text-black/70">{lead.name}</span>
        <span className="col-span-2 text-right">
          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[status]}`}>
            {status}
          </span>
        </span>
      </button>

      {open ? (
        <div className="grid grid-cols-1 gap-5 bg-black/[0.015] px-4 pb-5 pt-2 md:grid-cols-2">
          <div className="space-y-1.5 text-[13px]">
            <div><span className="text-black/50">Name:</span> {lead.name}</div>
            {lead.phone ? (
              <div>
                <span className="text-black/50">Phone:</span>{" "}
                <a className="underline" href={`tel:${lead.phone}`}>{lead.phone}</a>{" "}
                · <a className="text-emerald-700 underline" href={whatsappLink(lead.phone)} target="_blank" rel="noreferrer">WhatsApp</a>
              </div>
            ) : null}
            <div><span className="text-black/50">Email:</span> <a className="underline" href={`mailto:${lead.email}`}>{lead.email}</a></div>
            {lead.location ? <div><span className="text-black/50">Location:</span> {lead.location}</div> : null}
            {lead.deliveryAddress ? <div><span className="text-black/50">Delivery:</span> {lead.deliveryAddress}</div> : null}
            {lead.message ? <div className="whitespace-pre-line"><span className="text-black/50">Message:</span> {lead.message}</div> : null}
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setStatus(s);
                    patch({ status: s });
                  }}
                  className={`rounded-full border px-3 py-1 text-[12px] font-semibold capitalize ${
                    status === s ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/60 hover:bg-black/5"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => notes !== lead.notes && patch({ notes })}
              rows={3}
              placeholder="Notes (saved when you click away) — e.g. forwarded to factory sales rep"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-[13px]"
            />
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(forwardText(lead));
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[12px] font-semibold hover:bg-black/5"
            >
              {copied ? "Copied ✓" : "Copy details to forward"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function LeadInbox({ leads, clients }: { leads: AdminLead[]; clients: { _id: string; name: string }[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/dashboard${next.size ? `?${next}` : ""}`);
  }

  const select = "rounded-lg border border-black/10 bg-white px-2.5 py-2 text-[13px] font-semibold";

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <select value={params.get("client") || ""} onChange={(e) => setFilter("client", e.target.value)} className={select}>
          <option value="">All clients</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select value={params.get("type") || ""} onChange={(e) => setFilter("type", e.target.value)} className={select}>
          <option value="">All types</option>
          <option value="enquiry">Product enquiries</option>
          <option value="distributor">Distributor applications</option>
          <option value="contact">Contact messages</option>
        </select>
        <select value={params.get("status") || ""} onChange={(e) => setFilter("status", e.target.value)} className={select}>
          <option value="">Any status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-12 gap-3 border-b border-black/10 bg-black/[0.02] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-black/45">
            <span className="col-span-2">Received</span>
            <span className="col-span-2">Client</span>
            <span className="col-span-1">Type</span>
            <span className="col-span-3">About</span>
            <span className="col-span-2">From</span>
            <span className="col-span-2 text-right">Status</span>
          </div>
          {leads.length === 0 ? (
            <div className="px-4 py-10 text-center text-[14px] text-black/55">No leads match these filters yet.</div>
          ) : (
            leads.map((l) => <LeadRow key={l._id} lead={l} />)
          )}
        </div>
      </div>
    </div>
  );
}
