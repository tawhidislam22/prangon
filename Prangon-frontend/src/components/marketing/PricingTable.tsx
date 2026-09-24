import React from 'react';
import { Panel } from './Panel';
import Link from 'next/link';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for side projects and early startups.',
    features: ['Up to 5 workspaces', 'Community support', 'Basic analytics', '1GB storage'],
    cta: 'Start for free',
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    description: 'For scaling teams that need more power.',
    features: ['Unlimited workspaces', 'Priority support', 'Advanced analytics', '100GB storage', 'Custom domains'],
    cta: 'Upgrade to Pro',
    href: '/signup?plan=pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Dedicated support and infrastructure for large teams.',
    features: ['Dedicated infrastructure', '24/7 phone support', 'SLA uptime guarantee', 'Unlimited storage', 'SSO & SAML'],
    cta: 'Contact Sales',
    href: '/contact',
  },
];

export function PricingTable() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-line">
      {tiers.map((tier) => (
        <Panel key={tier.name} className="border-t-0 border-l-0 p-8 flex flex-col bg-paper h-full">
          <h3 className="font-display text-2xl text-ink mb-2">{tier.name}</h3>
          <p className="font-sans text-graphite mb-6 min-h-[48px]">{tier.description}</p>
          <div className="mb-8">
            <span className="font-display text-4xl text-ink">{tier.price}</span>
            {tier.period && <span className="font-sans text-graphite">{tier.period}</span>}
          </div>
          <ul className="space-y-4 mb-8 flex-grow">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start">
                <Check className="w-5 h-5 text-ink mr-3 shrink-0" strokeWidth={1.5} />
                <span className="font-sans text-graphite">{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href={tier.href}
            className={`flex h-12 items-center justify-center font-medium transition-colors ${
              tier.highlight
                ? 'bg-ink text-paper hover:bg-ink/90'
                : 'border border-line text-ink hover:bg-ink/5'
            }`}
          >
            {tier.cta}
          </Link>
        </Panel>
      ))}
    </div>
  );
}
