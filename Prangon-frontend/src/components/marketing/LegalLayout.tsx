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
        <h1 className="font-display text-4xl sm:text-5xl text-ink mb-3">
          {title}
        </h1>
        <p className="font-sans text-graphite text-sm">
          Last updated: {lastUpdated} · Questions?{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="text-cobalt hover:underline"
          >
            {contactEmail}
          </a>
        </p>
      </div>

      {/* Mobile TOC */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium text-ink"
        >
          <span>Table of Contents</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-graphite transition-transform",
              tocOpen && "rotate-180"
            )}
          />
        </button>
        {tocOpen && (
          <nav className="mt-2 rounded-lg border border-line bg-white p-4">
            <ul className="space-y-2">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={cn(
                      "text-left text-sm w-full hover:text-cobalt transition-colors",
                      activeId === section.id
                        ? "text-cobalt font-medium"
                        : "text-graphite"
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
            <h2 className="text-xs font-semibold uppercase tracking-wider text-graphite mb-4">
              On this page
            </h2>
            <ul className="space-y-1.5 border-l border-line">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={cn(
                      "block w-full text-left text-sm pl-4 py-1 -ml-px border-l-2 transition-colors",
                      activeId === section.id
                        ? "border-cobalt text-cobalt font-medium"
                        : "border-transparent text-graphite hover:text-ink hover:border-line"
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
        <div className="min-w-0 flex-1 max-w-[68ch]">
          <div className="prose prose-zinc max-w-none font-sans text-ink leading-relaxed prose-headings:font-display prose-headings:text-ink prose-a:text-cobalt prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-th:text-left prose-table:text-sm space-y-12">
            {children}
          </div>
        </div>
      </div>
    </Section>
  );
}
