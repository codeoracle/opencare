"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SiteHeader({
  name,
  logoUrl,
  enableDistributors,
}: {
  name: string;
  logoUrl: string;
  enableDistributors: boolean;
}) {
  const [open, setOpen] = useState(false);
  const nav = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/products", label: "Products" },
    ...(enableDistributors ? [{ href: "/become-a-distributor", label: "Become a Distributor" }] : []),
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={name} className="h-9 w-auto max-w-[160px] object-contain" />
          ) : (
            <span className="oc-display truncate text-[17px] font-semibold leading-tight text-black">{name}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-black/70 transition hover:text-black">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-black/90"
          >
            Order a Product
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-black/10 md:hidden"
        >
          <span className={cn("h-0.5 w-5 bg-black/80 transition", open && "translate-y-2 rotate-45")} />
          <span className={cn("h-0.5 w-5 bg-black/80 transition", open && "opacity-0")} />
          <span className={cn("h-0.5 w-5 bg-black/80 transition", open && "-translate-y-2 -rotate-45")} />
        </button>
      </div>

      {open ? (
        <div className="border-t border-black/5 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[14px] text-black/80 transition hover:bg-black/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2.5 text-[13px] font-semibold text-white"
          >
            Order a Product
          </Link>
        </div>
      ) : null}
    </header>
  );
}
