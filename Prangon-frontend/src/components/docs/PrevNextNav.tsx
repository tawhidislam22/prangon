import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getDocsPageNav } from "@/lib/docs-nav";

export function PrevNextNav({ href }: { href: string }) {
  const { prev, next } = getDocsPageNav(href);

  if (!prev && !next) return null;

  return (
    <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-line pt-8">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col w-full sm:w-1/2 gap-1 text-left p-4 rounded-lg border border-line hover:border-cobalt transition-colors"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-graphite">Previous</span>
          <span className="flex items-center gap-1 font-medium text-cobalt">
            <ChevronLeft className="h-4 w-4 shrink-0" />
            <span className="truncate">{prev.title}</span>
          </span>
        </Link>
      ) : <div className="w-full sm:w-1/2" />}
      
      {next && (
        <Link
          href={next.href}
          className="group flex flex-col w-full sm:w-1/2 items-end gap-1 text-right p-4 rounded-lg border border-line hover:border-cobalt transition-colors"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-graphite">Next</span>
          <span className="flex items-center gap-1 font-medium text-cobalt">
            <span className="truncate">{next.title}</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </span>
        </Link>
      )}
    </div>
  );
}
