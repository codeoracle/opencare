import type { ReactNode } from "react";

/** Full-bleed hero. Uses the client's image when set, otherwise a brand-colour gradient. */
export function Hero({
  image,
  eyebrow,
  title,
  subtitle,
  tall = false,
  children,
}: {
  image?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tall?: boolean;
  children?: ReactNode;
}) {
  // Without a photo a very tall hero is just empty colour, so keep it shorter.
  const height = tall && image ? "min-h-[78vh]" : tall ? "min-h-[60vh]" : "min-h-[48vh]";
  return (
    <section className={`relative overflow-hidden bg-[#0b1020] ${height}`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: image
            ? "linear-gradient(115deg, rgba(11,16,32,0.9) 0%, rgba(11,16,32,0.7) 45%, rgba(11,16,32,0.45) 100%)"
            : "linear-gradient(120deg, #0b1020 0%, color-mix(in srgb, var(--brand) 45%, #0b1020) 100%)",
        }}
      />
      <div
        aria-hidden
        className="oc-glow absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--brand) 40%, transparent) 0%, color-mix(in srgb, var(--brand2) 14%, transparent) 45%, transparent 70%)",
        }}
      />
      <div className={`relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-16 pt-24 ${height}`}>
        <div className="oc-rise-in max-w-3xl">
          {eyebrow ? (
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70">{eyebrow}</p>
          ) : null}
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.04] text-white sm:text-[60px]">{title}</h1>
          {subtitle ? (
            <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-white/75 sm:text-[16px]">{subtitle}</p>
          ) : null}
          {children ? <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
