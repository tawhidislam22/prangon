import React from 'react';
import { PricingTable } from '@/components/marketing/PricingTable';
import { ComparisonTable } from '@/components/marketing/ComparisonTable';
import { CTASection } from '@/components/marketing/CTASection';
import { Section } from '@/components/marketing/Section';

export default function PricingPage() {
  return (
    <>
      <Section variant="ink" className="py-20 md:py-28 bg-[#0B0F19] text-center border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Transparent Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Simple, predictable pricing. <br className="hidden sm:block" />
            Zero hidden seat taxes.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Start free on our Developer tier, then scale your workspaces and tenant shards as your enterprise customer base expands.
          </p>
        </div>
      </Section>

      <Section variant="paper" className="py-16 md:py-24">
        <PricingTable />
      </Section>

      <Section variant="elevated" className="py-20 md:py-28 border-t border-border">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Detailed Capability Comparison</h2>
          <p className="text-base text-muted-foreground mt-2">A comprehensive breakdown of enterprise features across each tier.</p>
        </div>
        <ComparisonTable />
      </Section>
      <CTASection />
    </>
  );
}
