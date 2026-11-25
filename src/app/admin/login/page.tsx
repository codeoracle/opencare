import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  const name = process.env.PLATFORM_NAME || "openCare";
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 py-12">
      <div className="w-full max-w-[440px] rounded-2xl border border-black/10 bg-white p-6 shadow-[0_16px_40px_rgba(11,16,32,0.06)] sm:p-8">
        <h1 className="text-center text-[30px] font-semibold">{name} Admin</h1>
        <p className="mt-3 text-center text-[14px] text-black/70">
          Sign in to manage clients, catalogues and leads.
        </p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
