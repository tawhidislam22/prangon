"use client";

import React, { useState } from 'react';
import { IntegrationCard } from '@/components/marketing/IntegrationCard';
import { CTASection } from '@/components/marketing/CTASection';
import { Section } from '@/components/marketing/Section';
import { Github, Slack, CreditCard, Mail, Search, Server, Key, BarChart3, Cloud } from 'lucide-react';
import { Input } from '@/components/ui/input';

const integrations = [
  { name: 'Stripe', description: 'Automate multi-tenant subscriptions, per-seat quotas, and customer billing portals.', category: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
  { name: 'GitHub', description: 'Sync repositories, trigger CI/CD builds, and map commit author roles.', category: 'Developer Tools', icon: <Github className="w-5 h-5" /> },
  { name: 'Slack', description: 'Real-time incident alerts, daily task digests, and workspace status updates.', category: 'Communication', icon: <Slack className="w-5 h-5" /> },
  { name: 'SendGrid', description: 'High-deliverability transactional emails for workspace invites and security alerts.', category: 'Email', icon: <Mail className="w-5 h-5" /> },
  { name: 'Okta SAML & SCIM', description: 'Enterprise identity sync with automated user onboarding and deprovisioning.', category: 'Security', icon: <Key className="w-5 h-5" /> },
  { name: 'AWS KMS', description: 'Customer-managed encryption keys for dedicated tenant database shards.', category: 'Security', icon: <Server className="w-5 h-5" /> },
  { name: 'Vercel', description: 'Deploy serverless edge compute with direct tenant proxy forwarding.', category: 'Hosting', icon: <Cloud className="w-5 h-5" /> },
  { name: 'Datadog', description: 'Real-time telemetry, latency metrics, and APM tracing per tenant shard.', category: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { name: 'PostHog', description: 'Privacy-focused tenant product analytics and event telemetry pipelines.', category: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
];

const categories = ['All', 'Billing', 'Security', 'Developer Tools', 'Communication', 'Analytics'];

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = integrations.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Section variant="ink" className="py-20 md:py-28 bg-[#0B0F19] text-center border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Ecosystem</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Connect Your Stack. <br className="hidden sm:block" />
            Zero Custom Adapters.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect PRANGON with your favorite developer tools, identity providers, and cloud services in minutes.
          </p>
        </div>
      </Section>

      <Section variant="paper" className="py-12 md:py-20">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search integrations..."
              className="pl-10 h-10 rounded-xl bg-card border-border text-sm focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((integration, idx) => (
            <IntegrationCard key={idx} {...integration} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 border border-border/60 rounded-2xl bg-card/40">
            <p className="text-base font-semibold text-foreground">No integrations match your search</p>
            <p className="text-xs text-muted-foreground mt-1">Try searching for a different keyword or category.</p>
          </div>
        )}
      </Section>

      <CTASection />
    </>
  );
}
