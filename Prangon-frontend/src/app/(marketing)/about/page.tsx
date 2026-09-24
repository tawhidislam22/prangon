import React from 'react';
import { Section } from '@/components/marketing/Section';
import { CTASection } from '@/components/marketing/CTASection';

export default function AboutPage() {
  return (
    <>
      <Section variant="paper" className="py-24 sm:py-32">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl sm:text-6xl text-ink mb-6">Building the foundation for SaaS.</h1>
          <p className="font-sans text-xl text-graphite leading-relaxed mb-12">
            We started Prangon because we were tired of rebuilding the same multi-tenant architecture for every new product. What if there was a platform that provided the secure, partitioned foundation out of the box?
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-16 border-t border-line">
          <div>
            <h2 className="font-display text-3xl text-ink mb-4">Our Mission</h2>
            <p className="font-sans text-graphite leading-relaxed">
              To accelerate software development by providing robust, secure primitives for multi-tenant applications. We believe developers should focus on their unique business logic, not boilerplate infrastructure.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-ink mb-4">Our Team</h2>
            <p className="font-sans text-graphite leading-relaxed">
              We are a remote-first team of engineers, designers, and operators who have scaled systems at some of the world's largest technology companies. We're backed by leading investors.
            </p>
          </div>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
