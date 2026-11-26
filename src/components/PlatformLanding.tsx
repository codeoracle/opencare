import Link from "next/link";
import { getPlatform } from "@/lib/platform";
import { getBrandCards, type BrandCard } from "@/lib/brands";
import { formatPhoneDisplay, whatsappLink } from "@/lib/utils";

const STEPS = [
  { n: "01", title: "Partner", desc: "We sign on as the manufacturer's distributor in Nigeria and agree the range, pricing and terms." },
  { n: "02", title: "Publicise", desc: "We give the brand a home online: its own store, social media content and campaigns that build awareness." },
  { n: "03", title: "Market", desc: "We put the products in front of shoppers, shops, salons, pharmacies and sub-distributors across Nigeria." },
  { n: "04", title: "Sell & distribute", desc: "We handle enquiries, orders, wholesale accounts and delivery, and report back to the manufacturer." },
];

const SERVICES = [
  { title: "Distribution", desc: "Importation, stock and delivery to retailers, wholesalers and end customers nationwide." },
  { title: "Marketing & sales", desc: "A dedicated sales team, WhatsApp ordering and a growing network of shops and distributors." },
  { title: "Brand publicity", desc: "An online store for every brand, product photos, social media promotion and ad campaigns." },
  { title: "Market feedback", desc: "Regular updates on what sells, what customers ask for and where demand is growing." },
];

const AUDIENCES = [
  { title: "Shoppers", desc: "Browse each brand's full range and order on WhatsApp in minutes." },
  { title: "Shops, salons & pharmacies", desc: "Buy wholesale across several brands from one contact." },
  { title: "Distributors", desc: "Apply on any brand's site to stock it in your city or state." },
  { title: "Manufacturers", desc: "Enter the Nigerian market without a local office. We distribute, market and promote your brand." },
];

function BrandTile({ b }: { b: BrandCard }) {
  return (
    <a
      href={b.href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_30px_rgba(11,16,32,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(11,16,32,0.12)]"
    >
      <div className="relative h-48 overflow-hidden bg-white" style={{ background: `linear-gradient(135deg, ${b.primaryColor}22, ${b.accentColor}22)` }}>
        {b.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={b.image}
            alt=""
            className={`h-full w-full transition duration-700 group-hover:scale-105 ${b.imageIsProduct ? "object-contain p-4" : "object-cover"}`}
          />
        ) : null}
        <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: b.primaryColor }} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex h-10 items-center gap-2.5">
          {b.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={b.logoUrl}
              alt={b.showNameWithLogo ? "" : b.name}
              className={b.showNameWithLogo ? "h-10 w-10 rounded-full object-cover" : "h-8 w-auto max-w-[150px] object-contain"}
            />
          ) : null}
          {!b.logoUrl || b.showNameWithLogo ? <span className="text-[18px] font-semibold">{b.name}</span> : null}
        </div>
        {b.tagline ? <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-black/60">{b.tagline}</p> : null}
        {b.categories.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {b.categories.slice(0, 4).map((c) => (
              <span key={c} className="rounded-full border border-black/10 px-2.5 py-0.5 text-[11px] font-semibold text-black/60">
                {c}
              </span>
            ))}
            {b.categories.length > 4 ? (
              <span className="px-1 py-0.5 text-[11px] font-semibold text-black/40">+{b.categories.length - 4} more</span>
            ) : null}
          </div>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-5 text-[13px] font-semibold">
          <span className="text-black/50">{b.products} products</span>
          <span style={{ color: b.primaryColor }}>Visit store →</span>
        </div>
      </div>
    </a>
  );
}

/** The openCare site: who we are, how it works, and the live list of client brands. */
export async function PlatformLanding() {
  const [platform, brands] = await Promise.all([getPlatform(), getBrandCards()]);
  const wa = platform.leadWhatsApp ? whatsappLink(platform.leadWhatsApp, `Hello ${platform.name}, I'd like to talk to you.`) : "";
  const partnerWa = platform.leadWhatsApp
    ? whatsappLink(platform.leadWhatsApp, `Hello ${platform.name}, I'm a manufacturer and I'd like to partner with you.`)
    : "";
  const totalProducts = brands.reduce((n, b) => n + b.products, 0);

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#0b1020]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f6f3]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="text-[20px] font-bold tracking-tight">
            open<span className="text-emerald-700">Care</span>
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] font-semibold text-black/65 md:flex">
            <a href="#brands" className="hover:text-black">Our brands</a>
            <a href="#how" className="hover:text-black">How it works</a>
            <a href="#partner" className="hover:text-black">Partner with us</a>
            <a href="#contact" className="hover:text-black">Contact</a>
          </nav>
          {wa ? (
            <a href={wa} target="_blank" rel="noreferrer" className="rounded-lg bg-black px-4 py-2 text-[13px] font-semibold text-white hover:bg-black/85">
              Chat with us
            </a>
          ) : null}
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#0b1020] text-white">
        <div aria-hidden className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-emerald-500/20 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 left-1/3 h-[380px] w-[380px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">Distributor · Nigeria</p>
          <h1 className="mt-5 max-w-3xl text-[40px] font-semibold leading-[1.05] sm:text-[60px]">
            We market, sell and promote great brands across Nigeria.
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-7 text-white/70">
            {platform.name} is a Nigerian distributor. We partner with manufacturers to market and sell
            their products and give their brands the publicity they deserve, from first launch to
            shelves, salons and homes nationwide.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#brands" className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3.5 text-[14px] font-semibold text-[#0b1020] hover:bg-emerald-400">
              Explore our brands
            </a>
            <a href="#partner" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-[14px] font-semibold hover:bg-white/10">
              I&apos;m a manufacturer
            </a>
          </div>
          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            <div><dt className="text-[12px] text-white/50">Partner brands</dt><dd className="mt-1 text-[30px] font-semibold">{brands.length}</dd></div>
            <div><dt className="text-[12px] text-white/50">Products</dt><dd className="mt-1 text-[30px] font-semibold">{totalProducts}</dd></div>
            <div><dt className="text-[12px] text-white/50">Ordering</dt><dd className="mt-1 text-[30px] font-semibold">Retail & B2B</dd></div>
          </dl>
        </div>
      </section>

      <section id="brands" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
        <h2 className="text-[32px] font-semibold">Our brands</h2>
        <p className="mt-2 max-w-2xl text-[15px] text-black/60">
          The manufacturers we distribute in Nigeria. Each brand has its own store with the full range:
          browse, then order retail or wholesale on WhatsApp.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.length ? (
            brands.map((b) => <BrandTile key={b.slug} b={b} />)
          ) : (
            <p className="text-[14px] text-black/55">New brands are coming soon.</p>
          )}
        </div>
      </section>

      <section id="how" className="scroll-mt-20 border-y border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-[32px] font-semibold">How it works</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-black/60">From partnership to publicity to sales, one team in Nigeria.</p>
          <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-2xl border border-black/8 bg-[#f7f6f3] p-5">
                <div className="text-[13px] font-bold text-emerald-700">{s.n}</div>
                <div className="mt-3 text-[16px] font-semibold">{s.title}</div>
                <p className="mt-2 text-[13px] leading-6 text-black/60">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="text-[32px] font-semibold">What we do for manufacturers</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((a) => (
            <div key={a.title} className="rounded-2xl border border-black/8 bg-white p-5">
              <div className="text-[16px] font-semibold">{a.title}</div>
              <p className="mt-2 text-[13px] leading-6 text-black/60">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-[32px] font-semibold">Who we work with</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="rounded-2xl border border-black/8 bg-white p-5">
              <div className="h-1 w-10 rounded-full bg-emerald-600" />
              <div className="mt-4 text-[16px] font-semibold">{a.title}</div>
              <p className="mt-2 text-[13px] leading-6 text-black/60">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="partner" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20">
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b1020] to-emerald-900 px-6 py-12 text-white sm:px-12">
          <h2 className="max-w-2xl text-[32px] font-semibold">Manufacturer? Make us your distributor in Nigeria.</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/70">
            We market and sell your products, build your brand&apos;s name with Nigerian buyers, and grow a
            network of shops and sub-distributors. You focus on making great products.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {partnerWa ? (
              <a href={partnerWa} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-6 py-3.5 text-[14px] font-semibold text-white hover:brightness-110">
                Talk to us on WhatsApp
              </a>
            ) : null}
            {platform.leadEmail ? (
              <a href={`mailto:${platform.leadEmail}?subject=Partnership%20with%20${encodeURIComponent(platform.name)}`} className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-[14px] font-semibold hover:bg-white/10">
                Email us
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <footer id="contact" className="scroll-mt-20 bg-[#0b1020] text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-3">
          <div>
            <div className="text-[20px] font-bold">open<span className="text-emerald-400">Care</span></div>
            <p className="mt-3 max-w-xs text-[13px] leading-6 text-white/60">
              Nigerian distributor partnering with manufacturers to market, sell and promote their brands.
            </p>
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">Brands</div>
            <div className="mt-4 flex flex-col gap-2 text-[13px]">
              {brands.map((b) => (
                <a key={b.slug} href={b.href} className="text-white/70 hover:text-white">{b.name}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">Contact</div>
            <div className="mt-4 space-y-2 text-[13px] text-white/70">
              {platform.leadPhone ? <div>Phone: <a className="underline decoration-white/20" href={`tel:${platform.leadPhone}`}>{formatPhoneDisplay(platform.leadPhone)}</a></div> : null}
              {wa ? <div>WhatsApp: <a className="underline decoration-white/20" href={wa} target="_blank" rel="noreferrer">{formatPhoneDisplay(platform.leadWhatsApp)}</a></div> : null}
              {platform.leadEmail ? <div>Email: <a className="underline decoration-white/20" href={`mailto:${platform.leadEmail}`}>{platform.leadEmail}</a></div> : null}
              <div>Lagos, Nigeria</div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl border-t border-white/10 px-4 py-6 text-[12px] text-white/40">
          © {new Date().getFullYear()} {platform.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
