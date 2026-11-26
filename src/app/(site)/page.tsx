import Link from "next/link";
import { withBase } from "@/lib/hosts";
import { getProducts } from "@/lib/queries";
import { getBasePath, getCurrentTenant } from "@/lib/tenant";
import { ProductCard } from "@/components/ProductCard";
import { PlatformLanding } from "@/components/PlatformLanding";
import { Hero } from "@/components/Hero";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [tenant, base] = await Promise.all([getCurrentTenant(), getBasePath()]);
  if (!tenant) return <PlatformLanding />;

  const products = await getProducts(tenant.id, { limit: 12 });
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const rest = products.filter((p) => !featured.includes(p)).slice(0, 8);
  const display = { currency: tenant.currency, showPrices: tenant.showPrices };

  return (
    <div>
      <Hero
        image={tenant.heroImage}
        eyebrow={tenant.heroEyebrow}
        title={tenant.heroTitle}
        subtitle={tenant.heroSubtitle}
        tall
      >
        <Link
          href={withBase(base, "/products")}
          className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-6 py-3.5 ring-1 ring-white/25 text-[14px] font-semibold text-[var(--brand-ink)] transition hover:brightness-110"
        >
          Browse Products
        </Link>
        {tenant.enableDistributors ? (
          <Link
            href={withBase(base, "/become-a-distributor")}
            className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-[14px] font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
          >
            Become a Distributor
          </Link>
        ) : (
          <Link
            href={withBase(base, "/contact")}
            className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-[14px] font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
          >
            Contact Us
          </Link>
        )}
      </Hero>

      {featured.length ? (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[30px] font-semibold">Featured products</h2>
              <p className="mt-2 text-[14px] text-black/65">Our most requested products.</p>
            </div>
            <Link href={withBase(base, "/products")} className="hidden text-[13px] font-semibold text-[var(--brand2)] hover:underline sm:inline">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} display={display} />
            ))}
          </div>
        </section>
      ) : null}

      {tenant.highlights.length ? (
        <section className="border-y border-black/5 bg-white/60">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-[30px] font-semibold">Why choose {tenant.name}</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {tenant.highlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-black/8 bg-white p-5">
                  <div className="h-1 w-10 rounded-full bg-[var(--brand2)]" />
                  <div className="mt-4 text-[16px] font-semibold">{item.title}</div>
                  {item.desc ? <p className="mt-2 text-[13px] leading-6 text-black/60">{item.desc}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[30px] font-semibold">{featured.length ? "More products" : "Our products"}</h2>
            <p className="mt-2 text-[14px] text-black/65">Explore the full catalogue.</p>
          </div>
          <Link
            href={withBase(base, "/products")}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--brand2)] px-4 py-2.5 text-[13px] font-semibold text-[var(--brand2-ink)] transition hover:brightness-110"
          >
            View catalogue
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rest.length === 0 && featured.length === 0 ? (
            <p className="col-span-full text-[14px] text-black/55">Products will appear here soon.</p>
          ) : (
            rest.map((p) => <ProductCard key={p._id} product={p} display={display} />)
          )}
        </div>
      </section>
    </div>
  );
}
