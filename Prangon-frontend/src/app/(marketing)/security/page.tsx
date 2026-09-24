import React from 'react';
import { IsolationDiagram } from '@/components/marketing/IsolationDiagram';
import { CTASection } from '@/components/marketing/CTASection';
import { Section } from '@/components/marketing/Section';
import { TrustBadge } from '@/components/marketing/TrustBadge';

export default function SecurityPage() {
  return (
    <>
      <Section variant="paper" className="py-24 sm:py-32 border-b border-line">
        <div className="max-w-3xl">
          <TrustBadge>SOC2 Type II Certified</TrustBadge>
          <h1 className="font-display text-5xl sm:text-6xl text-ink mb-6">Security by Default</h1>
          <p className="font-sans text-xl text-graphite">
            Enterprise-grade security controls baked into every layer of the Prangon platform.
          </p>
        </div>
      </Section>
      <Section variant="paper" className="py-24">
        <div className="max-w-3xl mb-12">
          <h2 className="font-display text-3xl text-ink mb-4">Strict Tenant Isolation</h2>
          <p className="font-sans text-graphite leading-relaxed">
            We employ rigorous data partitioning strategies to ensure tenant data remains strictly isolated. 
            Row-level security policies at the database layer prevent cross-tenant data leakage, even if application logic fails.
          </p>
        </div>
        <IsolationDiagram />
      </Section>
      <Section variant="paper" className="py-24 border-t border-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="font-display text-2xl text-ink mb-4">Encryption in Transit</h3>
            <p className="font-sans text-graphite leading-relaxed">All traffic between our edge nodes, application servers, and databases is encrypted using TLS 1.3.</p>
          </div>
          <div>
            <h3 className="font-display text-2xl text-ink mb-4">Encryption at Rest</h3>
            <p className="font-sans text-graphite leading-relaxed">Data is encrypted at rest using industry-standard AES-256 encryption. We regularly rotate master keys.</p>
          </div>
          <div>
            <h3 className="font-display text-2xl text-ink mb-4">Audit Logging</h3>
            <p className="font-sans text-graphite leading-relaxed">Comprehensive audit logs capture all authentication events, permission changes, and data access attempts.</p>
          </div>
          <div>
            <h3 className="font-display text-2xl text-ink mb-4">Vulnerability Scanning</h3>
            <p className="font-sans text-graphite leading-relaxed">Automated security scanning runs continuously on our codebase and infrastructure.</p>
          </div>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
