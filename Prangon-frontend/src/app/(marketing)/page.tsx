import React from 'react';
import { Hero } from '@/components/marketing/Hero';
import { FeatureGrid } from '@/components/marketing/FeatureGrid';
import { CTASection } from '@/components/marketing/CTASection';
import { Quote } from '@/components/marketing/Quote';
import { Section } from '@/components/marketing/Section';
import { TestimonialsCarousel } from '@/components/marketing/TestimonialsCarousel';
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      
      <Section variant="paper" className="py-20 md:py-28">
        <div className="max-w-4xl mb-16 mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Core Primitives</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Everything your SaaS needs. <br className="hidden sm:block" />
            Zero infrastructure debt.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Prangon handles the complex multi-tenant primitives so you can focus on building your core product. Hardware-grade isolation, automated billing, and granular RBAC built in.
          </p>
        </div>
        <FeatureGrid />
      </Section>

      <HowItWorksSection />
      
      <Section variant="elevated" className="py-16 md:py-24 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <Quote 
            quote="Prangon saved us months of engineering time. We launched our enterprise tier in weeks instead of quarters."
            author="Sarah Chen"
            role="CTO at Acme Corp"
          />
        </div>
      </Section>

      <TestimonialsCarousel />

      <CTASection />
    </>
  );
}
