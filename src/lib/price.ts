import { formatPrice } from "@/lib/utils";

export type PriceDisplay = { currency: string; showPrices: boolean };

export function priceLabel(price: number | undefined, display: PriceDisplay) {
  if (!display.showPrices || price == null) return "Price on request";
  return formatPrice(price, display.currency);
}
