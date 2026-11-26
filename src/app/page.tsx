import type { Metadata } from "next";
import { PlatformLanding } from "@/components/PlatformLanding";

export const dynamic = "force-dynamic";

const name = process.env.PLATFORM_NAME || "openCare";

export const metadata: Metadata = {
  title: `${name}: Distributor in Nigeria`,
  description: `${name} is a Nigerian distributor partnering with manufacturers to market and sell their products and give their brands publicity. Browse our brands and order retail or wholesale.`,
};

/** The openCare home page (platform address root). Brand stores live under /<slug>. */
export default function HomePage() {
  return <PlatformLanding />;
}
