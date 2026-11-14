"use client";

import { usePwa } from "@/providers/PwaProvider";
import { WifiOff } from "lucide-react";

export function PwaOfflineBanner() {
  const { isOnline } = usePwa();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[100] flex items-center justify-center gap-2 bg-yellow-500/90 px-4 py-2 text-xs font-medium text-yellow-950 backdrop-blur transition-all">
      <WifiOff className="h-3.5 w-3.5 flex-shrink-0" />
      <span>You&apos;re offline. Some features may be unavailable.</span>
    </div>
  );
}
