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
      
      <Section variant="paper" className="py-10 md:py-12">
        <div className="max-w-4xl mb-12 mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-6">
            Everything you need. <br className="hidden sm:block" />
            Nothing you don't.
          </h2>
          <p className="font-sans text-xl text-graphite">
            Prangon handles the complex infrastructure so you can focus on building your product. Multi-tenancy, authentication, and billing built right in.
          </p>
        </div>
        <FeatureGrid />
      </Section>

      <HowItWorksSection />
      
      <Section variant="paper" className="py-10 md:py-12 border-t border-line">
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
