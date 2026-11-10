"use client";

import React from 'react';
import { FeatureBlock } from '@/components/marketing/FeatureBlock';
import { CTASection } from '@/components/marketing/CTASection';
import { Section } from '@/components/marketing/Section';
import { motion } from 'framer-motion';

export default function FeaturesPage() {
  return (
    <>
      <Section variant="ink" className="py-20 md:py-28 bg-[#0B0F19] text-center border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Enterprise Primitives</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Engineered for Mission-Critical Multi-Tenancy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            A comprehensive suite of foundational primitives designed to help engineering teams deploy, isolate, and monetize multi-tenant applications with zero infrastructure drag.
          </motion.p>
        </div>
      </Section>
      
      <Section variant="paper" className="py-12 md:py-20">
        <FeatureBlock 
          tag="ISOLATION ENGINE"
          title="Hardware-Enforced Multi-Tenancy"
          description="Create isolated workspaces for your customers in seconds. We handle the complex data routing and partitioning automatically, ensuring tenant data is cryptographically isolated."
          highlights={[
            "Zero memory bleed across isolated tenant memory pools",
            "Automated per-tenant cryptographic keys with KMS integration",
            "Non-blocking database shard migration pipelines"
          ]}
          imageSrc="/feature_multitenant.jpg"
          imageAlt="Multi-tenant architecture dashboard"
        />
        <FeatureBlock 
          tag="ZERO-TRUST AUTH"
          title="Enterprise SSO & Directory Sync"
          description="Secure, frictionless login with support for Okta, Azure AD, Google Workspace SAML, and passwordless authentication out of the box. Protect your application without writing complex auth middleware."
          highlights={[
            "Real-time SCIM 2.0 user de-provisioning & group syncing",
            "Fine-grained RBAC & ABAC policy rule engine",
            "Tenant-level session invalidation & audit enforcement"
          ]}
          imageSrc="/feature_auth.jpg"
          imageAlt="Secure authentication flow"
          reverse
        />
        <FeatureBlock 
          tag="MONETIZATION"
          title="Automated Multi-Tenant Billing"
          description="Connect your Stripe account and automatically manage subscriptions, usage-based metering, per-seat quotas, and invoicing per workspace. Prevent churn with automated dunning flows."
          highlights={[
            "Usage-based metering for API requests, storage, and collaborators",
            "Self-service Stripe customer billing portal integration",
            "Automatic invoice generation and multi-currency support"
          ]}
          imageSrc="/feature_billing.jpg"
          imageAlt="SaaS Billing dashboard"
        />
      </Section>
      
      <CTASection />
    </>
  );
}
