"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  
  useEffect(() => {
    console.error("Project task board error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] p-8 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">Failed to load project</h2>
      <p className="text-slate-500 mb-6 max-w-md">
        We encountered an error while fetching the project details and tasks. Please try again or go back to the projects list.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href={`/owner/projects`}>
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    </div>
  );
}
