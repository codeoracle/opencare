import Link from "next/link";

export function NoClientYet() {
  return (
    <div className="rounded-2xl border border-dashed border-black/15 bg-white px-6 py-10 text-center">
      <div className="text-[16px] font-semibold">No clients yet</div>
      <p className="mt-2 text-[14px] text-black/60">Create your first client to start adding products.</p>
      <Link
        href="/admin/clients"
        className="mt-5 inline-flex rounded-xl bg-black px-5 py-2.5 text-[13px] font-semibold text-white"
      >
        Add a client
      </Link>
    </div>
  );
}
