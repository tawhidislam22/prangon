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
            <h4 className="flex items-center gap-2 rounded-md py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <section.icon className="h-3.5 w-3.5 text-primary" />
              {section.title}
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm pl-2 border-l border-border/70 ml-1.5 space-y-1">
              {section.items.map((item, j) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={j}
                    href={item.href}
                    className={cn(
                      "group flex w-full items-center px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold -ml-px border-l-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
