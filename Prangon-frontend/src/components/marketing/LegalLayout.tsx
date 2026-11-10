"use client";

import React, { useState, useEffect } from "react";
import { Section } from "./Section";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
  contactEmail: string;
  sections: TOCItem[];
}

export function LegalLayout({
  children,
  title,
  lastUpdated,
  contactEmail,
  sections,
}: LegalLayoutProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [tocOpen, setTocOpen] = useState(false);

  // Track which section is in view via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setTocOpen(false);
    }
  };

  return (
    <Section variant="paper" className="py-16 md:py-24">
      {/* Header */}
      <div className="max-w-4xl mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-3">
          {title}
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Last updated: {lastUpdated} · Questions?{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="text-primary hover:underline"
          >
            {contactEmail}
          </a>
        </p>
      </div>

      {/* Mobile TOC */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground"
        >
          <span>Table of Contents</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              tocOpen && "rotate-180"
            )}
          />
        </button>
        {tocOpen && (
          <nav className="mt-2 rounded-xl border border-border bg-card p-4">
            <ul className="space-y-2">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={cn(
                      "text-left text-sm w-full hover:text-primary transition-colors cursor-pointer",
                      activeId === section.id
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    {i + 1}. {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Two-column layout */}
      <div className="flex gap-12">
        {/* Sticky sidebar TOC — desktop only */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-24">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              On this page
            </h2>
            <ul className="space-y-1.5 border-l border-border">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={cn(
                      "block w-full text-left text-sm pl-4 py-1 -ml-px border-l-2 transition-colors cursor-pointer",
                      activeId === section.id
                        ? "border-primary text-primary font-semibold"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    {i + 1}. {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Prose content column */}
        <div className="min-w-0 flex-1 max-w-[70ch]">
          <div className="prose prose-zinc dark:prose-invert max-w-none font-sans text-foreground leading-relaxed prose-headings:font-bold prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-th:text-left prose-table:text-sm space-y-12">
            {children}
          </div>
        </div>
      </div>
    </Section>
  );
}
