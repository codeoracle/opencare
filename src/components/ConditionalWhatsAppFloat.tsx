"use client";

import { usePathname } from "next/navigation";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export function ConditionalWhatsAppFloat({ phone, businessName }: { phone: string; businessName: string }) {
  const pathname = usePathname();
  // Product pages have their own mobile WhatsApp bar.
  const isProductDetail = pathname.includes("/products/");

  return (
    <WhatsAppFloat
      phone={phone}
      message={`Hello ${businessName}, I need some help.`}
      className={isProductDetail ? "hidden lg:inline-flex" : undefined}
    />
  );
}
