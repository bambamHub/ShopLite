import { PackageOpen } from "lucide-react";

export function EmptyState({ message = "Nothing here yet." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 px-6 py-14 text-center">
      <PackageOpen className="h-8 w-8 text-gray-400" aria-hidden />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
