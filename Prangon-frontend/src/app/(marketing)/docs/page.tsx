import React from "react";
import { Section } from "@/components/marketing/Section";
import { DocsIndexCard } from "@/components/docs/DocsIndexCard";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { docsNav } from "@/lib/docs-nav";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Documentation | Prangon",
  description: "Learn how to use Prangon's collaborative workspace platform.",
};

export default function DocsLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-paper">
      {/* Hero */}
      <Section variant="ink" className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-5xl sm:text-6xl text-paper mb-6">
            Documentation
          </h1>
          <p className="font-sans text-xl text-paper/80 mb-10">
            Everything you need to set up your workspace, manage your team, and build with Prangon.
          </p>
          <div className="max-w-xl mx-auto text-left">
            <DocsSearch />
          </div>
        </div>
      </Section>

      {/* Category Grid */}
      <Section variant="paper" className="py-16 md:py-24 border-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-line rounded-tl-xl rounded-tr-xl overflow-hidden shadow-sm">
          {docsNav.map((section, i) => (
            <DocsIndexCard
              key={i}
              title={section.title}
              href={section.items[0].href}
              icon={section.icon}
              itemCount={section.items.length}
            />
          ))}
        </div>
      </Section>

      {/* Popular Articles */}
      <Section variant="paper" className="pt-0 pb-16 md:pb-24 border-none">
        <h2 className="font-display text-3xl text-ink mb-8">Popular guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Creating a Workspace", href: "/docs/getting-started/creating-a-workspace" },
            { title: "Roles & Permissions Overview", href: "/docs/roles-and-permissions" },
            { title: "Free vs Premium Plans", href: "/docs/plans-and-billing" },
          ].map((guide, i) => (
            <Link
              key={i}
              href={guide.href}
              className="group flex flex-col justify-between p-6 rounded-xl border border-line bg-white hover:border-cobalt transition-colors"
            >
              <span className="font-medium text-ink group-hover:text-cobalt mb-4">{guide.title}</span>
              <span className="flex items-center text-sm font-medium text-cobalt">
                Read guide <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
