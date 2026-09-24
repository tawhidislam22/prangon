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
    <div className="min-h-screen bg-paper pb-20">
      {/* Article Header */}
      <div className="w-full bg-white border-b border-line">
        <div className="container mx-auto px-6 max-w-4xl py-12 sm:py-20">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-medium text-graphite hover:text-cobalt transition-colors mb-10"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center rounded-full bg-cobalt/10 px-2.5 py-0.5 text-xs font-semibold text-cobalt uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-sm font-medium text-graphite">
              {post.readTime}
            </span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.1] tracking-tight mb-8">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper text-sm font-medium">
              {post.author.avatarInitials}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-medium text-ink">{post.author.name}</span>
              <span className="text-sm text-graphite">
                {post.author.role} · {post.date}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image Placeholder */}
      <div className="w-full px-6 -mt-8 relative z-10 mb-16">
        <div className={cn("max-w-5xl mx-auto h-64 sm:h-96 rounded-2xl shadow-sm border border-line/50", post.coverGradient)} />
      </div>

      {/* Article Content */}
      <Section variant="paper" className="py-0 border-none">
        <article className="max-w-[68ch] mx-auto prose prose-zinc prose-lg prose-headings:font-display prose-headings:text-ink prose-a:text-cobalt hover:prose-a:text-cobalt/80 prose-strong:text-ink text-graphite leading-relaxed">
          {/* We are safely injecting our trusted static HTML from blog-data.ts */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </Section>
    </div>
  );
}
