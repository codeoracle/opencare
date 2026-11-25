import nodemailer from "nodemailer";
import type { ILead } from "@/models/Lead";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

export async function sendEmail({ subject, html, to }: { subject: string; html: string; to?: string }) {
  const transporter = getTransporter();
  const recipient = to || process.env.LEAD_EMAIL || process.env.SMTP_USER;

  if (!transporter || !recipient) {
    console.warn("[email] SMTP not configured — logging email instead");
    console.log({ to: recipient, subject });
    return { queued: false, logged: true };
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: recipient,
    subject,
    html,
  });
  return { queued: true, logged: false };
}

function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: unknown) {
  if (value == null || value === "") return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${esc(label)}</td><td style="padding:4px 0">${esc(value).replace(/\n/g, "<br>")}</td></tr>`;
}

const TYPE_LABEL: Record<ILead["type"], string> = {
  enquiry: "Product enquiry",
  distributor: "Distributor application",
  contact: "Contact message",
};

/** One email layout for every lead type, tagged with the client name. */
export function leadEmail(lead: Partial<ILead> & Pick<ILead, "type" | "tenantName" | "name" | "email">, adminUrl?: string) {
  const label = TYPE_LABEL[lead.type];
  const headline =
    lead.type === "enquiry"
      ? lead.productName
      : lead.type === "distributor"
        ? lead.businessName
        : lead.subject;

  const subject = `[${lead.tenantName}] ${label}${headline ? `: ${headline}` : ""}`;
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
      <p style="margin:0 0 4px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.08em">${esc(lead.tenantName)}</p>
      <h2 style="margin:0 0 16px">${esc(label)}</h2>
      <table style="border-collapse:collapse">
        ${row("Product", lead.productName)}
        ${row("Quantity", lead.quantity)}
        ${row("Business", lead.businessName)}
        ${row("Subject", lead.subject)}
        ${row("Name", lead.name)}
        ${row("Email", lead.email)}
        ${row("Phone", lead.phone)}
        ${row("Location", [lead.city, lead.state].filter(Boolean).join(", "))}
        ${row("Delivery address", lead.deliveryAddress)}
        ${row("Message", lead.message)}
      </table>
      ${adminUrl ? `<p style="margin-top:20px"><a href="${esc(adminUrl)}">Open lead inbox</a></p>` : ""}
    </div>`;
  return { subject, html };
}
