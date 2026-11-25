import slugify from "slugify";

export function createSlug(text: string) {
  // Keep sizes readable: "60×60" → "60x60", "0.55mm" → "0-55mm", "A&B" → "a-and-b", "5%" → "5-percent".
  const prepared = text
    .replace(/×/g, "x")
    .replace(/(\d)\.(\d)/g, "$1-$2")
    .replace(/&/g, " and ")
    .replace(/%/g, " percent ");
  return slugify(prepared, { lower: true, strict: true });
}

export function formatPrice(amount: number | null | undefined, currency = "NGN") {
  if (amount == null || Number.isNaN(amount)) return "";
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-NG")}`;
  }
}

/** Nigerian-friendly: "0807 316 8427" → "2348073168427". */
export function normalizeWhatsAppNumber(phone: string) {
  let digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0") && digits.length >= 10) {
    digits = `234${digits.slice(1)}`;
  } else if (digits.length === 10) {
    digits = `234${digits}`;
  }
  return digits;
}

export function whatsappLink(phone: string, message?: string) {
  const clean = normalizeWhatsAppNumber(phone);
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${clean}${text}`;
}

/** "2348073168427" → "+234 807 316 8427" for display. */
export function formatPhoneDisplay(phone: string) {
  const d = normalizeWhatsAppNumber(phone);
  if (d.startsWith("234") && d.length === 13) {
    return `+234 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
  }
  return phone;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function splitLines(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.map((v) => v.trim()).filter(Boolean);
  return (value || "")
    .split(/\r?\n/)
    .map((v) => v.trim())
    .filter(Boolean);
}
