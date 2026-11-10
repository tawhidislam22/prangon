"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { DocsSidebar } from "./DocsSidebar";
import { DocsTOC, type TOCItem } from "./DocsTOC";
import { PrevNextNav } from "./PrevNextNav";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/marketing/Section";
import Link from "next/link";

export interface DocsLayoutProps {
  children: React.ReactNode;
  title: string;
  sections?: TOCItem[];
}

export function DocsLayout({ children, title, sections = [] }: DocsLayoutProps) {
  const pathname = usePathname();
  
  return (
    <Section variant="paper" className="py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden flex items-center border-b border-border pb-4 mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-card border-border">
                <Menu className="h-4 w-4" />
                Docs Navigation
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 pr-0 bg-card border-border">
              <SheetTitle className="sr-only">Documentation Menu</SheetTitle>
              <div className="h-full overflow-y-auto pr-6 pt-4">
                <DocsSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pr-4">
            <DocsSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 max-w-[72ch]">
          <div className="mb-8">
            <div className="flex items-center text-xs text-muted-foreground mb-4 gap-2">
               <Link href="/docs" className="hover:text-foreground hover:underline">Docs</Link>
               <ChevronRight className="h-3 w-3" />
               <span className="text-foreground font-medium truncate">{title}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {title}
            </h1>
          </div>
          
          <div className="prose prose-zinc dark:prose-invert max-w-none font-sans text-foreground leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-th:text-left prose-table:text-sm">
            {children}
          </div>

          <PrevNextNav href={pathname} />
        </main>

        {/* Desktop TOC */}
        {sections.length > 0 && <DocsTOC sections={sections} />}
      </div>
    </Section>
  );
}
