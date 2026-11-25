const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function safeHex(value: string | undefined | null, fallback: string) {
  return value && HEX.test(value.trim()) ? value.trim() : fallback;
}

function toRgb(hex: string) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Dark ink on light colours, white ink on dark colours (WCAG relative luminance). */
export function inkFor(hex: string) {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.4 ? "#0b1020" : "#ffffff";
}

export function themeVars(primary: string, accent: string): React.CSSProperties {
  const brand = safeHex(primary, "#2563eb");
  const brand2 = safeHex(accent, "#f97316");
  return {
    "--brand": brand,
    "--brand2": brand2,
    "--brand-ink": inkFor(brand),
    "--brand2-ink": inkFor(brand2),
  } as React.CSSProperties;
}
