import React from 'react';
import { Section } from '@/components/marketing/Section';
import { CTASection } from '@/components/marketing/CTASection';
import { ShieldCheck, Code2, Globe2, Cpu } from 'lucide-react';

const values = [
  {
    title: 'Zero-Leak Isolation',
    description: 'We believe tenant security should never rely on developer memory. We build primitives that enforce hardware-grade boundary checks automatically.',
    icon: ShieldCheck,
  },
  {
    title: 'Developer Ergonomics',
    description: 'Multi-tenancy shouldn’t require 5,000 lines of boilerplate. A single intuitive client SDK and simple declarative middleware should just work.',
    icon: Code2,
  },
  {
    title: 'Global Edge Speed',
    description: 'Sub-millisecond query execution and globally distributed proxy nodes ensure your international customers experience near-zero latency.',
    icon: Globe2,
  },
  {
    title: 'Enterprise Reliability',
    description: 'Guaranteed 99.999% SLA availability backed by automated failover sharding and non-blocking database migrations.',
    icon: Cpu,
  },
];

export default function AboutPage() {
  return (
    <>
      <Section variant="ink" className="py-20 md:py-28 bg-[#0B0F19] text-center border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Our Mission</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Building the Foundation for Modern Multi-Tenancy.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We started PRANGON to eliminate the repetitive architectural headaches of multi-tenant engineering, so developers can focus purely on product innovation.
          </p>
        </div>
      </Section>

      <Section variant="paper" className="py-16 md:py-24">
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Our Core Architecture Principles</h2>
          <p className="text-base text-muted-foreground mt-2">The standards that guide every line of code in the PRANGON multi-tenant engine.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-8 space-y-4 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">{val.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
