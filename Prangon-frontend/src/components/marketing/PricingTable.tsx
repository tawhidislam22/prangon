"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PricingTable() {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: 'Developer',
      price: '$0',
      period: 'forever',
      description: 'Ideal for early prototypes and side projects validating multi-tenant ideas.',
      features: [
        'Up to 3 isolated workspaces',
        '3 team members per workspace',
        'Community Discord support',
        'Standard audit logging (7 days)',
        'Shared compute pools',
        'Standard REST API access',
      ],
      cta: 'Start for Free',
      href: '/register',
      highlight: false,
    },
    {
      name: 'Growth',
      price: annual ? '$39' : '$49',
      period: '/month',
      description: 'Engineered for scaling SaaS businesses requiring automated billing and security.',
      features: [
        'Unlimited isolated workspaces',
        '20 collaborators per workspace',
        'Priority email & Slack support',
        'Extended audit logging (90 days)',
        'Dedicated connection pooling',
        'Custom workspace domains',
        'Automated Stripe dunning flows',
      ],
      cta: 'Upgrade to Growth',
      href: '/register?tier=growth',
      highlight: true,
      badge: 'MOST POPULAR',
    },
    {
      name: 'Enterprise Scale',
      price: 'Custom',
      period: 'tailored',
      description: 'Dedicated infrastructure, custom SLAs, and SCIM directory syncing for enterprise scale.',
      features: [
        'Unlimited workspaces & members',
        'Dedicated hardware-isolated pods',
        '24/7 dedicated support engineer',
        '99.999% SLA guarantee',
        'SAML 2.0 & Okta SCIM syncing',
        'Custom cryptographic KMS keys',
        'Custom BAA / HIPAA compliance',
      ],
      cta: 'Contact Architecture Team',
      href: '/contact',
      highlight: false,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Billing Cadence Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-semibold cursor-pointer ${!annual ? 'text-foreground' : 'text-muted-foreground'}`} onClick={() => setAnnual(false)}>
          Monthly Billing
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          onClick={() => setAnnual(!annual)}
          className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
            annual ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
              annual ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <span className={`text-sm font-semibold flex items-center gap-1.5 cursor-pointer ${annual ? 'text-foreground' : 'text-muted-foreground'}`} onClick={() => setAnnual(true)}>
          <span>Annual Billing</span>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            SAVE 20%
          </span>
        </span>
      </div>

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
              tier.highlight
                ? 'bg-card/90 border-2 border-primary shadow-2xl shadow-primary/10 ring-1 ring-primary/30 md:-translate-y-2'
                : 'bg-card/60 backdrop-blur-md border border-border hover:border-primary/40 hover:shadow-lg'
            }`}
          >
            {tier.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-md">
                <Sparkles className="w-3 h-3" />
                <span>{tier.badge}</span>
              </div>
            )}

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mb-6 min-h-[40px] leading-relaxed">{tier.description}</p>
              
              <div className="mb-8 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-mono">{tier.price}</span>
                <span className="text-sm text-muted-foreground font-medium">{tier.period}</span>
              </div>

              <div className="space-y-3 pt-6 border-t border-border/60 mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Included capabilities:</p>
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              asChild
              className={`w-full h-11 font-semibold rounded-xl transition-all cursor-pointer ${
                tier.highlight
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border'
              }`}
            >
              <Link href={tier.href} className="flex items-center justify-center gap-2">
                <span>{tier.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
