import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Hero } from "@/components/Hero";
import { getCurrentTenant } from "@/lib/tenant";
import { whatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "About Us" };

export default async function AboutPage() {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();

  const wa = tenant.contact.whatsapp
    ? whatsappLink(tenant.contact.whatsapp, `Hello ${tenant.name}, I'd like to learn more about your products.`)
    : "";
  const paragraphs = tenant.about.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div>
      <Hero
        image={tenant.aboutImage || tenant.heroImage}
        eyebrow="About us"
        title={tenant.aboutTitle}
        subtitle={tenant.aboutIntro || tenant.tagline}
      >
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-6 py-3.5 ring-1 ring-white/25 text-[14px] font-semibold text-[var(--brand-ink)] transition hover:brightness-110"
        >
          Explore Products
        </Link>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-[14px] font-semibold text-white transition hover:brightness-110"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        ) : null}
      </Hero>

      {paragraphs.length || tenant.stats.length ? (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-[30px] font-semibold">Who we are</h2>
              {paragraphs.map((p, i) => (
                <p key={i} className="mt-4 whitespace-pre-line text-[14px] leading-7 text-black/70">
                  {p}
                </p>
              ))}
            </div>
            {tenant.stats.length ? (
              <div className="grid grid-cols-2 gap-4">
                {tenant.stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-black/8 bg-white p-5 shadow-[0_8px_30px_rgba(11,16,32,0.04)]">
                    <div className="oc-display text-[28px] font-semibold text-[var(--brand2)]">{item.value}</div>
                    <div className="mt-2 text-[13px] font-semibold text-black/60">{item.label}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {tenant.highlights.length ? (
        <section className="border-y border-black/5 bg-white/70">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-[30px] font-semibold">Why choose {tenant.name}</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {tenant.highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-black/8 bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(11,16,32,0.08)]"
                >
                  <div className="h-1 w-10 rounded-full bg-[var(--brand2)]" />
                  <div className="mt-4 text-[16px] font-semibold">{item.title}</div>
                  {item.desc ? <p className="mt-2 text-[13px] leading-6 text-black/60">{item.desc}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {tenant.audiences.length ? (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-[30px] font-semibold">Who we serve</h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {tenant.audiences.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-black/75"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {tenant.faqs.length ? (
        <section className="bg-[#0b1020] text-white">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-[30px] font-semibold">Frequently asked questions</h2>
            <div className="mt-8 space-y-3">
              {tenant.faqs.map((item) => (
                <details key={item.q} className="group rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <summary className="cursor-pointer list-none text-[15px] font-semibold">
                    <span className="flex items-center justify-between gap-4">
                      {item.q}
                      <span className="text-white/50 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 whitespace-pre-line text-[14px] leading-7 text-white/70">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-[28px] bg-gradient-to-br from-[#0b1020] to-[color-mix(in_srgb,var(--brand)_40%,#0b1020)] px-6 py-10 text-center sm:px-10">
          <h2 className="mx-auto max-w-xl text-[32px] font-semibold text-white">Ready to order?</h2>
          <p className="mx-auto mt-3 max-w-xl text-[14px] leading-7 text-white/70">
            Browse the catalogue, send an enquiry, or talk to us directly.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-6 py-3.5 ring-1 ring-white/25 text-[14px] font-semibold text-[var(--brand-ink)] transition hover:brightness-110"
            >
              Shop Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
