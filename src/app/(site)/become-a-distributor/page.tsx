import Link from "next/link";
import { withBase } from "@/lib/hosts";
import { notFound } from "next/navigation";
import { DistributorApplicationForm } from "@/components/DistributorApplicationForm";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { getBasePath, getCurrentTenant } from "@/lib/tenant";
import { whatsappLink } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Become a Distributor" };

const DEFAULT_BENEFITS = [
  { title: "Quality products", desc: "Sell a catalogue customers already trust." },
  { title: "Partner support", desc: "Pricing, stock and marketing help from our team." },
  { title: "Fast follow-up", desc: "We reply by email or WhatsApp after you apply." },
];

export default async function DistributorPage() {
  const [tenant, base] = await Promise.all([getCurrentTenant(), getBasePath()]);
  if (!tenant || !tenant.enableDistributors) notFound();

  const wa = tenant.contact.whatsapp
    ? whatsappLink(tenant.contact.whatsapp, `Hello ${tenant.name}, I'm interested in becoming a distributor.`)
    : "";
  const benefits = tenant.distributorBenefits.length ? tenant.distributorBenefits : DEFAULT_BENEFITS;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-16">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="lg:pr-8">
          <h1 className="text-[34px] font-semibold">Distributors Wanted</h1>
          <p className="mt-3 whitespace-pre-line text-[14px] leading-7 text-black/70">
            {tenant.distributorIntro ||
              `Partner with ${tenant.name} and bring our products to customers in your area.`}
          </p>

          <div className="mt-6 space-y-3">
            {benefits.map((x) => (
              <div key={x.title} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[var(--brand2)]" />
                <div>
                  <div className="text-[14px] font-semibold">{x.title}</div>
                  {x.desc ? <div className="mt-1 text-[13px] text-black/65">{x.desc}</div> : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-[14px] font-semibold text-white transition hover:brightness-110"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Ask on WhatsApp
              </a>
            ) : null}
            <Link
              href={withBase(base, "/products")}
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-[14px] font-semibold transition hover:bg-black/5"
            >
              Review Products
            </Link>
          </div>
        </div>

        <DistributorApplicationForm />
      </div>
    </div>
  );
}
