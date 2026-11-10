"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { DocsSidebar } from "./DocsSidebar";
import { DocsTOC, type TOCItem } from "./DocsTOC";
import { PrevNextNav } from "./PrevNextNav";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface DocsLayoutProps {
  children: React.ReactNode;
  title: string;
  sections?: TOCItem[];
}

export function DocsLayout({ children, title, sections = [] }: DocsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="w-full bg-background text-foreground">
      <div className="w-full max-w-[1536px] mx-auto flex items-start">
        
        {/* Desktop Left Navigation Sidebar - STICKY PINNED TO VIEWPORT */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0 border-r border-border/70 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="h-full overflow-y-auto px-6 py-6 scrollbar-thin">
            <DocsSidebar />
          </div>
        </aside>

        {/* Center Documentation Content */}
        <main
          id="docs-content"
          className="flex-1 min-w-0 px-6 sm:px-10 lg:px-12 xl:px-16 py-8 md:py-10"
        >
          <div className="max-w-[76ch] mx-auto">
            {/* Mobile Sidebar Trigger & Breadcrumbs */}
            <div className="lg:hidden flex items-center justify-between border-b border-border/70 pb-4 mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-card border-border text-xs font-medium">
                    <Menu className="h-4 w-4" />
                    Menu
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 pr-0 bg-card border-border">
                  <SheetTitle className="sr-only">Documentation Menu</SheetTitle>
                  <div className="h-full overflow-y-auto pr-6 pt-4 scrollbar-thin">
                    <DocsSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center text-xs text-muted-foreground gap-1.5 truncate max-w-[200px]">
                <Link href="/docs" className="hover:text-foreground">Docs</Link>
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span className="text-foreground font-medium truncate">{title}</span>
              </div>
            </div>

            {/* Desktop Breadcrumbs */}
            <div className="hidden lg:flex items-center text-xs text-muted-foreground mb-4 gap-2">
              <Link href="/docs" className="hover:text-foreground hover:underline">Docs</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium truncate">{title}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              {title}
            </h1>

            {/* Article Content */}
            <div className="prose prose-zinc dark:prose-invert max-w-none font-sans text-foreground leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-th:text-left prose-table:text-sm prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
              {children}
            </div>

            {/* Previous / Next Navigation */}
            <div className="mt-12 pb-16">
              <PrevNextNav href={pathname} />
            </div>
          </div>
        </main>

        {/* Desktop Right TOC Sidebar - STICKY PINNED TO VIEWPORT */}
        {sections.length > 0 && (
          <aside className="hidden xl:block w-56 2xl:w-64 shrink-0 border-l border-border/70 sticky top-16 h-[calc(100vh-4rem)]">
            <div className="h-full overflow-y-auto px-6 py-8 scrollbar-thin">
              <DocsTOC sections={sections} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
