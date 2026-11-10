import React from "react";
import Link from "next/link";
import { Section } from "@/components/marketing/Section";
import { blogPosts } from "@/lib/blog-data";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Blog | Prangon",
  description: "Product updates, engineering deep dives, and best practices from the Prangon team.",
};

export default function BlogIndex() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <Section variant="ink" className="py-20 sm:py-28 bg-[#0B0F19] text-center border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Engineering &amp; Product</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            The PRANGON Blog
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Product updates, multi-tenant engineering deep dives, and architecture guides from the PRANGON team.
          </p>
        </div>
      </Section>

      {/* Blog Grid */}
      <Section variant="paper" className="py-16 md:py-24 border-none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col h-full rounded-2xl border border-border bg-card/60 backdrop-blur-md overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Card Header (Placeholder Image) */}
              <div className={cn("h-48 w-full transition-transform duration-500 group-hover:scale-105", post.coverGradient)} />
              
              {/* Card Body */}
              <div className="flex flex-col flex-1 p-6 sm:p-8 bg-card/90 z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {post.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {post.readTime}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                      {post.author.avatarInitials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground leading-none mb-1">{post.author.name}</span>
                      <span className="text-xs text-muted-foreground leading-none">{post.date}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
