/** Thin bar on client stores viewed through openCare, linking back to the brand list. */
export function BrandBar({ platformName, brandName }: { platformName: string; brandName: string }) {
  return (
    <div className="bg-[#0b1020] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-[12px]">
        {/* Full page load on purpose: the middleware clears the brand preview cookie. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/?client=" className="font-semibold text-white/80 hover:text-white">
          ← All {platformName} brands
        </a>
        <span className="truncate text-white/50">{brandName} is distributed by {platformName}</span>
      </div>
    </div>
  );
}
