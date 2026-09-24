"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-10 w-10 text-red-500" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="font-display text-3xl sm:text-4xl text-ink mb-3">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-graphite text-base mb-8 leading-relaxed">
          An unexpected error occurred. Please try again, or return to the home
          page if the problem persists.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="text-xs text-graphite/60 font-mono mb-6 bg-muted rounded-md px-3 py-2 inline-block">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="bg-cobalt hover:bg-cobalt/90 text-white rounded-md gap-2 w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-md gap-2 w-full sm:w-auto"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
