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
    <div className="flex flex-col min-h-screen bg-paper">
      {/* Hero Section */}
      <Section variant="ink" className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-5xl sm:text-6xl text-paper mb-6">
            The Prangon Blog
          </h1>
          <p className="font-sans text-xl text-paper/80 mb-0">
            Product updates, engineering deep dives, and thoughts on building better workspaces.
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
              className="group flex flex-col h-full rounded-xl border border-line bg-white overflow-hidden hover:border-cobalt transition-colors duration-200"
            >
              {/* Card Header (Placeholder Image) */}
              <div className={cn("h-48 w-full transition-transform duration-500 group-hover:scale-105", post.coverGradient)} />
              
              {/* Card Body */}
              <div className="flex flex-col flex-1 p-6 sm:p-8 bg-white z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cobalt">
                    {post.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-line-dark" />
                  <span className="text-xs font-medium text-graphite">
                    {post.readTime}
                  </span>
                </div>
                
                <h2 className="font-display text-2xl text-ink mb-3 group-hover:text-cobalt transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-graphite text-sm leading-relaxed mb-8 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-line">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper text-xs font-medium">
                      {post.author.avatarInitials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-ink leading-none mb-1">{post.author.name}</span>
                      <span className="text-xs text-graphite leading-none">{post.date}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-line group-hover:text-cobalt transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
