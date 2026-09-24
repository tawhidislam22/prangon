import React from 'react';
import { PricingTable } from '@/components/marketing/PricingTable';
import { ComparisonTable } from '@/components/marketing/ComparisonTable';
import { CTASection } from '@/components/marketing/CTASection';
import { Section } from '@/components/marketing/Section';

export default function PricingPage() {
  return (
    <>
      <Section variant="paper" className="py-24 sm:py-32 border-b border-line">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl sm:text-6xl text-ink mb-6">Simple, transparent pricing</h1>
          <p className="font-sans text-xl text-graphite">
            Start for free, then scale as you grow. No hidden fees or surprise overages.
          </p>
        </div>
      </Section>
      <Section variant="paper" className="py-12">
        <PricingTable />
      </Section>
      <Section variant="paper" className="py-24">
        <div className="max-w-3xl mb-12">
          <h2 className="font-display text-4xl text-ink">Compare Plans</h2>
          <p className="font-sans text-graphite mt-4">A detailed breakdown of features across all our tiers.</p>
        </div>
        <ComparisonTable />
      </Section>
      <CTASection />
    </>
  );
}
