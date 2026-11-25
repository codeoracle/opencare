import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center text-[#0b1020]">
      <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-black/40">404</div>
      <h1 className="mt-3 text-[30px] font-semibold">Page not found</h1>
      <p className="mt-2 text-[14px] text-black/60">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="mt-6 rounded-xl bg-black px-5 py-2.5 text-[13px] font-semibold text-white">
        Go home
      </Link>
    </div>
  );
}
