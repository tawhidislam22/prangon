"use client";

import React from 'react';
import { FeatureBlock } from '@/components/marketing/FeatureBlock';
import { CTASection } from '@/components/marketing/CTASection';
import { Section } from '@/components/marketing/Section';
import { motion } from 'framer-motion';

export default function FeaturesPage() {
  return (
    <>
      <Section variant="paper" className="pt-16 pb-12 md:pt-24 md:pb-16 border-b border-line">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-display text-5xl sm:text-6xl text-ink mb-6"
          >
            Platform Features
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="font-sans text-xl text-graphite"
          >
            A comprehensive suite of tools designed to help you build and scale multi-tenant applications faster.
          </motion.p>
        </div>
      </Section>
      
      <Section variant="paper" className="py-10 md:py-12">
        <FeatureBlock 
          title="Instant Multi-Tenancy"
          description="Create isolated workspaces for your customers in seconds. We handle the complex data routing and partitioning automatically, ensuring tenant data is cryptographically secure."
          imageSrc="/feature_multitenant.jpg"
          imageAlt="Multi-tenant architecture dashboard"
        />
        <FeatureBlock 
          title="Built-in Authentication"
          description="Secure, frictionless login with support for SSO, SAML, and passwordless authentication out of the box. Protect your application without writing complex auth middleware."
          imageSrc="/feature_auth.jpg"
          imageAlt="Secure authentication flow"
          reverse
        />
        <FeatureBlock 
          title="Automated Billing"
          description="Connect your Stripe account and automatically manage subscriptions, usage-based billing, and invoicing per workspace. Prevent churn with automated dunning flows."
          imageSrc="/feature_billing.jpg"
          imageAlt="SaaS Billing dashboard"
        />
      </Section>
      
      <CTASection />
    </>
  );
}
