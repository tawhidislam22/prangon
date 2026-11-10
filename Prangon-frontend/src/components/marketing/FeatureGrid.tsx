import React from 'react';
import { Layers, Shield, Zap, Globe, Cpu, Lock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    name: 'Hardware-Enforced Multi-Tenancy',
    tag: 'AES-256-GCM',
    description: 'Cryptographically partition compute and storage per tenant. Zero memory bleed with automated tenant shard routing.',
    icon: Layers,
    href: '/security',
  },
  {
    name: 'Enterprise Security & Compliance',
    tag: 'SOC2 Type II',
    description: 'SOC2 Type II and HIPAA ready. Automated audit telemetry, TLS 1.3 encryption, and continuous pen-testing built in.',
    icon: Shield,
    href: '/security',
  },
  {
    name: 'Sub-Millisecond Execution',
    tag: '< 1.2ms P99',
    description: 'Globally distributed edge proxies paired with optimized connection pooling ensure lightning-fast tenant resolution.',
    icon: Zap,
    href: '/features',
  },
  {
    name: 'Global Edge Network',
    tag: '34+ Cloud Regions',
    description: 'Deploy localized tenant pods across 34 global cloud regions in under 800ms. Keep data resident in local jurisdictions.',
    icon: Globe,
    href: '/features',
  },
  {
    name: 'Automated Monetization & Billing',
    tag: 'Stripe Native',
    description: 'Manage usage-based metering, per-seat quotas, automated dunning, and invoicing per workspace out of the box.',
    icon: Cpu,
    href: '/pricing',
  },
  {
    name: 'Granular RBAC & Policy Engine',
    tag: 'Zero-Trust',
    description: 'Declare human-readable ABAC and RBAC security boundaries. Restrict project, task, and tenant capabilities effortlessly.',
    icon: Lock,
    href: '/features',
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className="group relative rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-7 flex flex-col justify-between hover:border-primary/40 hover:bg-card/90 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border group-hover:border-primary/30 group-hover:text-primary transition-colors">
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
              <Link href={feature.href} className="inline-flex items-center gap-1 hover:underline">
                <span>Learn architecture</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
