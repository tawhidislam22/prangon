import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/marketing/Section";
import { getBlogPost, blogPosts } from "@/lib/blog-data";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = getBlogPost(resolvedParams.slug);
  
  if (!post) {
    return { title: "Post Not Found | Prangon" };
  }

  return {
    title: `${post.title} | Prangon Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = getBlogPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Article Header */}
      <div className="w-full bg-card border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl py-12 sm:py-20">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs font-medium text-muted-foreground font-mono">
              {post.readTime}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-8">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
              {post.author.avatarInitials}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground">{post.author.name}</span>
              <span className="text-xs text-muted-foreground font-mono">
                {post.author.role} · {post.date}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image Placeholder */}
      <div className="w-full px-6 -mt-8 relative z-10 mb-16">
        <div className={cn("max-w-5xl mx-auto h-64 sm:h-96 rounded-2xl shadow-xl border border-border/60", post.coverGradient)} />
      </div>

      {/* Article Content */}
      <Section variant="paper" className="py-0 border-none">
        <article className="max-w-[70ch] mx-auto prose prose-zinc dark:prose-invert prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-a:text-primary hover:prose-a:underline prose-strong:text-foreground text-muted-foreground leading-relaxed">
          {/* We are safely injecting our trusted static HTML from blog-data.ts */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </Section>
    </div>
  );
}
