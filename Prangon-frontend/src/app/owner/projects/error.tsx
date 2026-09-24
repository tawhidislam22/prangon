"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Projects error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] p-8 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Failed to load projects</h2>
      <p className="text-slate-500 mb-6 max-w-md">
        We encountered an error while fetching your projects. Please try again.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
