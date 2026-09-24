"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TOCItem { id: string; title: string; }

export function DocsTOC({ sections }: { sections: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    const elements = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (!sections.length) return null;

  return (
    <nav className="sticky top-24 hidden xl:block w-48 shrink-0 self-start">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-graphite mb-4">On this page</h4>
      <ul className="space-y-1.5 border-l border-line text-sm">
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className={cn(
              "block pl-4 py-1 -ml-px border-l-2 transition-colors",
              activeId === section.id ? "border-cobalt text-cobalt font-medium" : "border-transparent text-graphite hover:text-ink hover:border-line"
            )}>
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
