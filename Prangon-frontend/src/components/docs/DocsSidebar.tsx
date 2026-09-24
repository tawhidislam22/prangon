"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docsNav } from "@/lib/docs-nav";
import { DocsSearch } from "./DocsSearch";

export function DocsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 w-full", className)}>
      <div className="mb-6">
        <DocsSearch />
      </div>
      <div className="space-y-8">
        {docsNav.map((section, i) => (
          <div key={i} className="flex flex-col gap-2">
            <h4 className="flex items-center gap-2 rounded-md py-1 text-sm font-semibold text-ink">
              <section.icon className="h-4 w-4 text-cobalt" />
              {section.title}
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm pl-2 border-l border-line ml-2 space-y-1">
              {section.items.map((item, j) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={j}
                    href={item.href}
                    className={cn(
                      "group flex w-full items-center border border-transparent px-2 py-1 transition-colors",
                      isActive
                        ? "font-medium text-cobalt"
                        : "text-graphite hover:text-ink hover:underline"
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
