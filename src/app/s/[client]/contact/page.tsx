import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { SocialIcons } from "@/components/SocialIcons";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { getCurrentTenant } from "@/lib/tenant";
import { formatPhoneDisplay, whatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact Us" };

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-2 h-2 w-2 rounded-full bg-[var(--brand2)]" />
      <div>
        <div className="text-[14px] font-semibold">{label}</div>
        <div className="text-[13px] text-black/65">{children}</div>
      </div>
    </div>
  );
}

export default async function ContactPage() {
  const tenant = await getCurrentTenant();
  if (!tenant) notFound();
  const { contact } = tenant;
  const wa = contact.whatsapp ? whatsappLink(contact.whatsapp, `Hello ${tenant.name}, I'd like to make an enquiry.`) : "";
  const hasSocial = Object.values(tenant.socialLinks).some(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-16">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="lg:pr-8">
          <h1 className="text-[34px] font-semibold">Let&apos;s talk</h1>
          <p className="mt-3 text-[14px] leading-7 text-black/70">
            Reach out for product enquiries, bulk orders and partnerships.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            {contact.phone ? (
              <Line label="Phone">
                <a className="underline" href={`tel:${contact.phone}`}>
                  {formatPhoneDisplay(contact.phone)}
                </a>
              </Line>
            ) : null}
            {contact.whatsapp ? (
              <Line label="WhatsApp">
                <a className="underline" href={wa} target="_blank" rel="noreferrer">
                  {formatPhoneDisplay(contact.whatsapp)}
                </a>
              </Line>
            ) : null}
            {contact.email ? (
              <Line label="Email">
                <a className="underline" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </Line>
            ) : null}
            {tenant.location ? <Line label="Location">{tenant.location}</Line> : null}

            {hasSocial ? (
              <div>
                <div className="text-[14px] font-semibold">Follow us</div>
                <div className="mt-3">
                  <SocialIcons links={tenant.socialLinks} tone="dark" />
                </div>
              </div>
            ) : null}

            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-[14px] font-semibold text-white transition hover:brightness-110"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Continue on WhatsApp
              </a>
            ) : null}
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
