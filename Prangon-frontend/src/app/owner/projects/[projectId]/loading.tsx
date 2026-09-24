import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProjectTaskBoardLoading() {
  return (
    <div className="p-8">
      <div className="mb-4">
        <div className="text-sm text-slate-300 flex items-center gap-1 w-fit">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </div>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {/* Mock columns */}
        {Array.from({ length: 4 }).map((_, colIndex) => (
          <div key={colIndex} className="bg-slate-50 rounded-xl p-4 min-w-[320px] w-[320px] shrink-0 border border-slate-100 flex flex-col max-h-[calc(100vh-220px)]">
            <div className="flex items-center justify-between mb-4 px-1">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <div key={cardIndex} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
