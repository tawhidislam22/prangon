"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Section } from "./Section";
import { Layers, Shield, Zap, Terminal, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Layers,
    title: "Model Workspaces & Tenants",
    description: "Define customer workspace schemas and isolated database partitions with declarative primitives. Zero raw SQL boilerplate.",
    code: `import { PrangonClient } from "@prangon/sdk-node";

export const prangon = new PrangonClient({
  apiKey: process.env.PRANGON_API_KEY,
  isolationMode: "CRYPTOGRAPHIC_SHARD",
  defaultRegion: "eu-west-1",
});`,
    terminal: "✔ Workspace partition created: acme-corp (id: wsp_9a823b1)"
  },
  {
    step: "02",
    icon: Shield,
    title: "Inject Zero-Trust Middleware",
    description: "Every HTTP request is verified against cryptographic tenant cookies, enforcing strict Row-Level Security at the edge.",
    code: `import { createTenantGuard } from "@prangon/middleware";

export const middleware = createTenantGuard({
  strictIsolation: true,
  enforceAuditLog: true,
  onTenantMismatch: "REJECT_WITH_ALERT",
});`,
    terminal: "✔ Tenant context verified: tenant_id='wsp_9a823b1' [0.8ms]"
  },
  {
    step: "03",
    icon: Zap,
    title: "Scale Globally with Automated Billing",
    description: "Provision multi-region pods in under 800ms while Stripe syncs per-seat quotas and usage meters automatically.",
    code: `await prangon.billing.meterUsage({
  workspaceId: "wsp_9a823b1",
  metric: "active_collaborators",
  quantity: 24,
});`,
    terminal: "✔ Usage synced with Stripe webhook: tier='ENTERPRISE_SCALE'"
  }
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <Section variant="ink" className="py-20 md:py-28 relative overflow-hidden bg-[#0A0E18]">
      {/* Background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-[1320px] mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Architecture Walkthrough</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            How PRANGON powers your stack
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Transition from a fragile single-database architecture to hardware-grade multi-tenancy in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Steps List */}
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 space-y-4"
          >
            {steps.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "border-primary/50 bg-slate-900/90 shadow-xl shadow-primary/10"
                      : "border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                      isActive ? "bg-primary text-primary-foreground" : "bg-slate-800 text-slate-400"
                    }`}>
                      {s.step}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed pl-11">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </motion.div>

          {/* Interactive Code & Execution Terminal */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-[#0F131D] shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">sdk-integration.ts</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE CLOUD RUNTIME</span>
                </div>
              </div>

              {/* Code Panel */}
              <div className="p-6 font-mono text-xs sm:text-sm text-slate-300 bg-slate-950/40 overflow-x-auto">
                <pre className="leading-relaxed">
                  <code>{steps[activeStep].code}</code>
                </pre>
              </div>

              {/* Terminal Output */}
              <div className="px-6 py-4 border-t border-slate-800/80 bg-[#070A11] flex items-center gap-3">
                <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-xs text-emerald-400 truncate">
                  {steps[activeStep].terminal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
