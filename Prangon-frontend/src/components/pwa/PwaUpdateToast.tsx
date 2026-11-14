"use client";

import { useEffect } from "react";
import { usePwa } from "@/providers/PwaProvider";
import { toast } from "sonner";

export function PwaUpdateToast() {
  const { isUpdateAvailable, applyUpdate } = usePwa();

  useEffect(() => {
    if (!isUpdateAvailable) return;

    toast("Update available", {
      description: "A new version of Prangon is ready.",
      duration: Infinity, // keep visible until user acts
      action: {
        label: "Update now",
        onClick: applyUpdate,
      },
      id: "pwa-update", // deduplicate
    });
  }, [isUpdateAvailable, applyUpdate]);

  // Renders nothing — uses Sonner toast
  return null;
}
