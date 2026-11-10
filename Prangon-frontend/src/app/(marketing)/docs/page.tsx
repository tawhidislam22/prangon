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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <Section variant="ink" className="py-20 sm:py-28 bg-[#0B0F19] text-center border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Knowledge Base</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            PRANGON Documentation
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Everything you need to provision multi-tenant workspaces, enforce zero-trust isolation, and scale with the PRANGON API.
          </p>
          <div className="max-w-xl mx-auto text-left pt-2">
            <DocsSearch />
          </div>
        </div>
      </Section>

      {/* Category Grid */}
      <Section variant="paper" className="py-16 md:py-24 border-none">
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Browse by Topic</h2>
          <p className="text-sm text-muted-foreground mt-1">Explore guided architectures, APIs, and administrative controls.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <Section variant="elevated" className="py-16 md:py-24 border-t border-border">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-8">Popular Architecture Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Creating & Sharding Workspaces", href: "/docs/getting-started/creating-a-workspace" },
            { title: "Roles, Permissions & RBAC Policies", href: "/docs/roles-and-permissions" },
            { title: "Free vs Premium Multi-Tenant Plans", href: "/docs/plans-and-billing" },
          ].map((guide, i) => (
            <Link
              key={i}
              href={guide.href}
              className="group flex flex-col justify-between p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <span className="font-semibold text-base text-foreground group-hover:text-primary mb-4 leading-snug">{guide.title}</span>
              <span className="flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                Read guide <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
