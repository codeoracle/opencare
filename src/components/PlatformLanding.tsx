import Link from "next/link";
import { getPlatform } from "@/lib/platform";
import { formatPhoneDisplay, whatsappLink } from "@/lib/utils";

/** Shown on the openCare domain itself (no client matched). */
export async function PlatformLanding() {
  const platform = await getPlatform();
  const wa = platform.leadWhatsApp
    ? whatsappLink(platform.leadWhatsApp, `Hello ${platform.name}, I'd like to partner with you.`)
    : "";

  return (
    <div className="flex min-h-screen flex-col bg-[#0b1020] text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <div className="text-[18px] font-semibold tracking-tight">{platform.name}</div>
        <Link href="/admin/login" className="text-[13px] font-semibold text-white/60 transition hover:text-white">
          Sign in
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-16">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">
          Distribution partner for manufacturers
        </p>
        <h1 className="mt-4 max-w-3xl text-[40px] font-semibold leading-[1.05] sm:text-[58px]">
          We take your products to market.
        </h1>
        <p className="mt-5 max-w-xl text-[16px] leading-7 text-white/70">
          {platform.name} builds and runs a product catalogue and lead site for each manufacturer we
          partner with, and handles every enquiry, distributor application and WhatsApp order.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-6 py-3.5 text-[14px] font-semibold text-white transition hover:brightness-110"
            >
              Chat on WhatsApp
            </a>
          ) : null}
          {platform.leadEmail ? (
            <a
              href={`mailto:${platform.leadEmail}`}
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-[14px] font-semibold transition hover:bg-white/10"
            >
              Email us
            </a>
          ) : null}
        </div>
      </main>
      <footer className="mx-auto w-full max-w-6xl px-4 py-6 text-[12px] text-white/40">
        © {new Date().getFullYear()} {platform.name}
        {platform.leadPhone ? ` · ${formatPhoneDisplay(platform.leadPhone)}` : ""}
      </footer>
    </div>
  );
}
