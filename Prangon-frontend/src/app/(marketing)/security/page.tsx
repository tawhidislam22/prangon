import React from 'react';
import { IsolationDiagram } from '@/components/marketing/IsolationDiagram';
import { CTASection } from '@/components/marketing/CTASection';
import { Section } from '@/components/marketing/Section';
import { TrustBadge } from '@/components/marketing/TrustBadge';
import { ShieldCheck, Lock, Key, FileCheck, Eye, Terminal } from 'lucide-react';

const securityPillars = [
  {
    title: 'Encryption in Transit',
    description: 'All ingress and internal cluster communications utilize TLS 1.3 with Perfect Forward Secrecy and HSTS enforcement.',
    icon: Lock,
    spec: 'TLS 1.3',
  },
  {
    title: 'Encryption at Rest',
    description: 'Database tables, tenant shards, and file uploads are encrypted using AES-256-GCM with automated KMS key rotation.',
    icon: Key,
    spec: 'AES-256-GCM',
  },
  {
    title: 'Immutable Audit Logging',
    description: 'Comprehensive, cryptographically verified audit trails record all authorization checks, member invites, and data accesses.',
    icon: FileCheck,
    spec: 'Real-time SIEM',
  },
  {
    title: 'Continuous Vulnerability Scans',
    description: 'Automated dependency scanning, static code analysis, and third-party penetration tests run against every release.',
    icon: Eye,
    spec: '24/7 Monitoring',
  },
  {
    title: 'Row-Level Tenant Isolation',
    description: 'Database policies enforce strict tenant boundaries at the storage layer, preventing data leaks even in edge scenarios.',
    icon: ShieldCheck,
    spec: 'Kernel RLS',
  },
  {
    title: 'SOC2 & HIPAA Ready',
    description: 'Verified controls designed to pass enterprise vendor security reviews and compliance questionnaires in minutes.',
    icon: Terminal,
    spec: 'Type II Audited',
  },
];

export default function SecurityPage() {
  return (
    <>
      <Section variant="ink" className="py-20 md:py-28 bg-[#0B0F19] text-center border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto space-y-4">
          <TrustBadge>SOC2 Type II Certified</TrustBadge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Security by Architecture. <br className="hidden sm:block" />
            Zero Trust by Default.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade security controls baked directly into the PRANGON multi-tenant primitive engine.
          </p>
        </div>
      </Section>

      <Section variant="paper" className="py-16 md:py-24">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Data Boundary</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Strict Tenant Boundary Enforcement</h2>
          <p className="text-base text-muted-foreground mt-2 leading-relaxed">
            We employ rigorous multi-layer data partitioning strategies ensuring tenant datasets remain strictly segregated in compute, cache, and persistent storage.
          </p>
        </div>
        <IsolationDiagram />
      </Section>

      <Section variant="elevated" className="py-20 md:py-28 border-t border-border">
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Comprehensive Security Controls</h2>
          <p className="text-base text-muted-foreground mt-2">Built to withstand rigorous enterprise vendor reviews and third-party penetration audits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-7 space-y-4 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border">
                    {p.spec}
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-foreground">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
