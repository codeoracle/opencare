import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/utils";
import type { ProductCard as ProductCardData } from "@/types/catalog";

export type { ProductCardData };

export type PriceDisplay = { currency: string; showPrices: boolean };

export function priceLabel(price: number | undefined, display: PriceDisplay) {
  if (!display.showPrices || price == null) return "Price on request";
  return formatPrice(price, display.currency);
}

export function ProductCard({ product, display }: { product: ProductCardData; display: PriceDisplay }) {
  const img = product.images?.[0];
  const subtitle = [product.brand?.name, product.category?.name].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_30px_rgba(11,16,32,0.04)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--brand)]/35 hover:shadow-[0_24px_50px_rgba(11,16,32,0.12)]"
    >
      {/* Pack shots on white, shown whole (contain) rather than cropped. */}
      <div className="relative h-[220px] overflow-hidden border-b border-black/5 bg-white">
        <div className="absolute inset-4 transition duration-700 group-hover:scale-[1.05]">
          <ProductImage src={img} alt={product.name} />
        </div>
        <div className="absolute bottom-3 right-3">
          <div className="translate-y-2 rounded-full bg-black/80 px-3 py-1 text-[12px] font-semibold text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            View
          </div>
        </div>
      </div>

      <div className="p-4">
        {subtitle ? (
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand2)]">{subtitle}</div>
        ) : null}
        <div className="oc-display mt-1 text-[18px] font-semibold leading-snug transition group-hover:text-[var(--brand2)]">
          {product.name}
        </div>
        {product.shortDescription ? (
          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-black/60">{product.shortDescription}</p>
        ) : null}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[15px] font-semibold">{priceLabel(product.price, display)}</div>
          <div className="text-[12px] font-semibold text-[var(--brand2)] opacity-0 transition group-hover:opacity-100">
            Enquire →
          </div>
        </div>
      </div>
    </Link>
  );
}
