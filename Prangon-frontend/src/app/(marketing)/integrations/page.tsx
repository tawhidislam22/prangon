import React from 'react';
import { IntegrationCard } from '@/components/marketing/IntegrationCard';
import { CTASection } from '@/components/marketing/CTASection';
import { Section } from '@/components/marketing/Section';
import { Github, Slack, CreditCard, Mail } from 'lucide-react';

const integrations = [
  { name: 'Stripe', description: 'Automate billing and subscriptions for your tenants.', category: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
  { name: 'GitHub', description: 'Sync repositories and manage CI/CD pipelines.', category: 'Developer Tools', icon: <Github className="w-5 h-5" /> },
  { name: 'Slack', description: 'Send real-time alerts and notifications to workspace channels.', category: 'Communication', icon: <Slack className="w-5 h-5" /> },
  { name: 'SendGrid', description: 'Reliable transactional email delivery for invites and alerts.', category: 'Email', icon: <Mail className="w-5 h-5" /> },
  // Adding more dummy ones for the grid
  { name: 'Vercel', description: 'Seamless frontend deployments and edge compute.', category: 'Hosting' },
  { name: 'Datadog', description: 'Comprehensive monitoring and observability.', category: 'Analytics' },
];

export default function IntegrationsPage() {
  return (
    <>
      <Section variant="paper" className="py-24 sm:py-32 border-b border-line">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl sm:text-6xl text-ink mb-6">Integrations</h1>
          <p className="font-sans text-xl text-graphite">
            Connect Prangon with the tools you already use. Extend your workspace capabilities with one-click integrations.
          </p>
        </div>
      </Section>
      <Section variant="paper" className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-line">
          {integrations.map((integration, idx) => (
            <IntegrationCard key={idx} {...integration} />
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
