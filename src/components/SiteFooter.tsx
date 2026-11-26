import Link from "next/link";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { SocialIcons } from "@/components/SocialIcons";
import { formatPhoneDisplay, whatsappLink } from "@/lib/utils";
import type { SiteTenant } from "@/lib/tenant";
import { withBase } from "@/lib/hosts";

export function SiteFooter({ tenant, basePath = "" }: { tenant: SiteTenant; basePath?: string }) {
  const { contact } = tenant;
  const wa = contact.whatsapp ? whatsappLink(contact.whatsapp, `Hello ${tenant.name}, I'd like product support.`) : "";
  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
    ...(tenant.enableDistributors ? [{ href: "/become-a-distributor", label: "Become a Distributor" }] : []),
    { href: "/contact", label: "Contact" },
  ].map((l) => ({ ...l, href: withBase(basePath, l.href) }));

  return (
    <footer className="border-t border-black/5 bg-[#0b1020] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="oc-display text-[22px] font-semibold">{tenant.name}</div>
            {tenant.footerBlurb ? (
              <p className="mt-3 max-w-sm text-[13px] leading-6 text-white/65">{tenant.footerBlurb}</p>
            ) : null}
            <div className="mt-5">
              <SocialIcons links={tenant.socialLinks} tone="light" />
            </div>
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-110"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            ) : null}
          </div>

          <div className="md:col-span-3">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">Explore</div>
            <div className="mt-4 flex flex-col gap-2.5 text-[13px]">
              {links.map((l) => (
                <Link key={l.href} className="text-white/70 transition hover:text-white" href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">Contact</div>
            <div className="mt-4 space-y-2 text-[13px] text-white/70">
              {contact.phone ? (
                <div>
                  Phone:{" "}
                  <a className="underline decoration-white/20 hover:text-white" href={`tel:${contact.phone}`}>
                    {formatPhoneDisplay(contact.phone)}
                  </a>
                </div>
              ) : null}
              {contact.whatsapp ? (
                <div>
                  WhatsApp:{" "}
                  <a className="underline decoration-white/20 hover:text-white" href={wa} target="_blank" rel="noreferrer">
                    {formatPhoneDisplay(contact.whatsapp)}
                  </a>
                </div>
              ) : null}
              {contact.email ? (
                <div>
                  Email:{" "}
                  <a className="underline decoration-white/20 hover:text-white" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </div>
              ) : null}
              {tenant.location ? <div>{tenant.location}</div> : null}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-[12px] text-white/45">
          © {new Date().getFullYear()} {tenant.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
