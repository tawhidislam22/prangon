"use client";

import { useEffect, useState } from "react";
import { usePwa } from "@/providers/PwaProvider";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "prangon-install-dismissed";

export function PwaInstallBanner() {
  const { isStandalone, isIOS, canInstall, promptInstall } = usePwa();
  const [dismissed, setDismissed] = useState(true); // start hidden, reveal after mount

  useEffect(() => {
    // Read localStorage only on client
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  // Don't show if: already installed, already dismissed, or neither prompt nor iOS guidance
  if (isStandalone || dismissed || (!canInstall && !isIOS)) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-192x192.png"
          alt="Prangon"
          className="h-10 w-10 flex-shrink-0 rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Install Prangon</p>
          {isIOS ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tap <Share className="inline h-3 w-3" /> then &quot;Add to Home Screen&quot; to install.
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Install for a faster, app-like experience.
            </p>
          )}
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss install banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Only show Install button for Android/Desktop; iOS gets text guidance */}
      {canInstall && (
        <Button
          size="sm"
          className="mt-3 w-full gap-2"
          onClick={async () => {
            await promptInstall();
            dismiss();
          }}
        >
          <Download className="h-4 w-4" />
          Install App
        </Button>
      )}
    </div>
  );
}
