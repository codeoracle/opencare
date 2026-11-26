import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries";
import { getCurrentTenant } from "@/lib/tenant";
import { formatPrice } from "@/lib/utils";
import { priceLabel } from "@/lib/price";
import { ProductEnquiryForm } from "@/components/ProductEnquiryForm";
import { ProductPixelTracker } from "@/components/ProductPixelTracker";
import { ProductGallery } from "@/components/ProductGallery";
import {
  ProductWhatsAppCTA,
  ProductWhatsAppMobileBar,
  ProductWhatsAppOrderButton,
} from "@/components/ProductWhatsAppCTA";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
  const product = await getProductBySlug(tenant.id, (await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: { images: product.images?.length ? [product.images[0]] : undefined },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();

  const { slug } = await params;
  const product = await getProductBySlug(tenant.id, slug);
  if (!product) notFound();

  const display = { currency: tenant.currency, showPrices: tenant.showPrices };
  const showPrice = tenant.showPrices && product.price != null;
  const whatsappPhone = tenant.contact.whatsapp;
  const pixelProduct = {
    advertised: Boolean(product.isAdvertised),
    productId: product._id || product.slug,
    productName: product.name,
    price: product.price ?? 0,
  };
  const cta = { phone: whatsappPhone, businessName: tenant.name, ...pixelProduct };

  return (
    <>
      <ProductPixelTracker {...pixelProduct} />
      <div className="mx-auto max-w-6xl px-4 py-10 pb-24 lg:pb-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <ProductGallery images={product.images ?? []} name={product.name} />

            <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5">
              {product.brand || product.category ? (
                <div className="text-[12px] font-semibold text-black/55">
                  {[product.brand?.name, product.category?.name].filter(Boolean).join(" • ")}
                </div>
              ) : null}
              <h1 className="mt-2 text-[28px] font-semibold leading-[1.1]">{product.name}</h1>
              <p className="mt-3 whitespace-pre-line text-[14px] leading-7 text-black/70">
                {product.shortDescription || product.description}
              </p>

              <div className="mt-5 flex items-baseline gap-3">
                <div className="oc-display text-[24px] font-semibold text-[var(--brand2)]">
                  {priceLabel(product.price, display)}
                </div>
                {showPrice && product.compareAtPrice ? (
                  <div className="text-[13px] font-semibold text-black/45 line-through">
                    {formatPrice(product.compareAtPrice, tenant.currency)}
                  </div>
                ) : null}
              </div>

              {whatsappPhone ? (
                <div className="mt-5 space-y-3 lg:hidden">
                  <ProductWhatsAppCTA {...cta} />
                  <ProductWhatsAppOrderButton {...cta} />
                </div>
              ) : null}

              {product.shortDescription && product.description !== product.shortDescription ? (
                <div className="mt-6">
                  <div className="text-[12px] font-semibold text-black/55">Description</div>
                  <p className="mt-2 whitespace-pre-line text-[14px] leading-7 text-black/70">{product.description}</p>
                </div>
              ) : null}

              {product.specs?.length ? (
                <div className="mt-6">
                  <div className="text-[12px] font-semibold text-black/55">Specifications</div>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {product.specs.map((s, idx) => (
                      <div key={idx} className="rounded-xl border border-black/10 px-3 py-2">
                        <div className="text-[12px] font-semibold text-black/60">{s.label}</div>
                        <div className="text-[13px] font-semibold">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.features?.length ? (
                <div className="mt-6">
                  <div className="text-[12px] font-semibold text-black/55">Highlights</div>
                  <ul className="mt-3 space-y-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex gap-3 text-[14px] text-black/70">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand2)]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className="oc-rise-in lg:sticky lg:top-24 lg:self-start">
            <ProductEnquiryForm
              productSlug={product.slug}
              productName={product.name}
              businessName={tenant.name}
              whatsappPhone={whatsappPhone}
              advertised={pixelProduct.advertised}
              productId={pixelProduct.productId}
              price={pixelProduct.price}
            />
          </div>
        </div>
      </div>

      {whatsappPhone ? <ProductWhatsAppMobileBar {...cta} /> : null}
    </>
  );
}
