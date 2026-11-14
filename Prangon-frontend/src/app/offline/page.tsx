"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WifiOff, RefreshCw, Home, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : false
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      window.location.reload();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    if (navigator.onLine) {
      window.location.reload();
    } else {
      setTimeout(() => {
        setIsRetrying(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-xl border border-border bg-card text-card-foreground text-center">
        <CardHeader className="pb-3">
          <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <WifiOff className="size-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            You&apos;re Offline
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            No active internet connection was detected.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          <div className="p-3.5 bg-muted/60 border border-border/80 rounded-xl text-left text-xs text-muted-foreground space-y-1.5">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <ShieldAlert className="size-4 text-amber-500 shrink-0" />
              <span>Workspace Safe Mode</span>
            </div>
            <p className="leading-relaxed">
              Prangon has cached static assets locally. Dynamic operations (like creating tasks or inviting members) require an active connection and will resume once reconnected.
            </p>
          </div>
          {isOnline && (
            <p className="text-xs text-emerald-600 font-semibold animate-pulse">
              Connection detected! Reloading...
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 border-t border-border pt-4">
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full sm:flex-1 font-semibold text-xs gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Checking Connection..." : "Try Reconnecting"}</span>
          </Button>
          <Link href="/owner/dashboard" className="w-full sm:flex-1">
            <Button
              variant="outline"
              className="w-full font-semibold text-xs border-border gap-1.5"
            >
              <Home className="size-3.5" />
              <span>Cached Dashboard</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
