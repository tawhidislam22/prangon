"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docsNav } from "@/lib/docs-nav";
import { DocsSearch } from "./DocsSearch";

export function DocsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active category header and item into view when path changes
  useEffect(() => {
    const el = activeSectionRef.current;
    if (!el) return;

    // Find the scrollable container (either an overflow-y-auto ancestor or our container)
    let scrollParent: HTMLElement | null = el.parentElement;
    while (scrollParent) {
      const style = window.getComputedStyle(scrollParent);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        break;
      }
      scrollParent = scrollParent.parentElement;
    }

    const targetContainer = scrollParent || containerRef.current;
    if (targetContainer) {
      const containerRect = targetContainer.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      const isAbove = elRect.top < containerRect.top + 20;
      const isBelow = elRect.bottom > containerRect.bottom - 20;

      if (isAbove || isBelow) {
        const offset = elRect.top - containerRect.top + targetContainer.scrollTop;
        targetContainer.scrollTo({
          top: Math.max(0, offset - 32),
          behavior: "smooth",
        });
      }
    }
  }, [pathname]);

  return (
    <div ref={containerRef} className={cn("pb-12 w-full", className)}>
      <div className="mb-6">
        <DocsSearch />
      </div>
      <div className="space-y-7">
        {docsNav.map((section, i) => {
          const isSectionActive = section.items.some(
            (item) => item.href === pathname || pathname.startsWith(item.href)
          );

          return (
            <div
              key={i}
              ref={isSectionActive ? activeSectionRef : null}
              className="flex flex-col gap-1.5 transition-colors"
            >
              <Link
                href={section.items[0].href}
                className={cn(
                  "group flex items-center gap-2 rounded-md py-1 px-1.5 text-xs font-bold uppercase tracking-wider transition-colors",
                  isSectionActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <section.icon className="h-3.5 w-3.5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">{section.title}</span>
              </Link>
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
          );
        })}
      </div>
    </div>
  );
}
