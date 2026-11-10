import React from 'react';
import { ContactForm } from '@/components/marketing/ContactForm';
import { Section } from '@/components/marketing/Section';
import { Mail, Clock, MapPin, ShieldAlert, Sparkles } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Section variant="ink" className="py-20 md:py-28 bg-[#0B0F19] text-center border-b border-white/[0.08]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Direct Access</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Talk to Solutions Engineering
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about multi-tenant architecture, compliance review, or custom enterprise terms? We are here to help.
          </p>
        </div>
      </Section>

      <Section variant="paper" className="py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Engineering-First Support
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You will speak directly with senior software architects and systems engineers who understand data partitioning and zero-trust security.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Sales &amp; Enterprise Scenarios</h3>
                  <a href="mailto:sales@prangon.com" className="text-xs text-primary font-medium hover:underline">sales@prangon.com</a>
                  <p className="text-xs text-muted-foreground mt-0.5">Custom contracts, dedicated shard hosting, and volume discounts.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Security &amp; Compliance</h3>
                  <a href="mailto:security@prangon.com" className="text-xs text-primary font-medium hover:underline">security@prangon.com</a>
                  <p className="text-xs text-muted-foreground mt-0.5">SOC2 reports, penetration test summaries, and security questionnaires.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Response SLA</h3>
                  <p className="text-xs text-emerald-400 font-medium">Under 1 hour response time</p>
                  <p className="text-xs text-muted-foreground mt-0.5">24/7 coverage for active enterprise tier workspaces.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
