import React from 'react';
import { Section } from './Section';
import Link from 'next/link';

export function CTASection() {
  return (
    <Section variant="ink" className="py-10 md:py-12">
      <div className="max-w-3xl">
        <h2 className="font-display text-4xl sm:text-5xl text-paper mb-6">
          Ready to build your SaaS?
        </h2>
        <p className="font-sans text-xl text-paper/80 mb-10">
          Join thousands of developers building scalable, multi-tenant applications with Prangon today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/pricing" className="inline-flex h-12 items-center justify-center bg-paper text-ink px-8 font-medium hover:bg-paper/90 transition-colors">
            Start Building
          </Link>
          <Link href="/contact" className="inline-flex h-12 items-center justify-center border border-line-dark text-paper px-8 font-medium hover:bg-paper/10 transition-colors">
            Talk to Sales
          </Link>
        </div>
      </div>
    </Section>
  );
}
