import { getPlatform } from "@/lib/platform";
import { PlatformForm } from "@/components/admin/PlatformForm";

export default async function AdminSettingsPage() {
  const platform = await getPlatform();
  return (
    <div>
      <h1 className="text-[30px] font-semibold">Settings</h1>
      <p className="mt-2 text-[14px] text-black/65">
        Where leads go and which contacts client sites show by default.
      </p>
      <div className="mt-6 max-w-3xl">
        <PlatformForm initial={platform} />
      </div>
    </div>
  );
}
