"use client";

import React from 'react';
import { Section } from './Section';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <Section variant="ink" className="py-20 md:py-28 relative overflow-hidden bg-slate-950">
      {/* Radiant atmospheric background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Launch Your Multi-Tenant SaaS Today</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Ready to future-proof your enterprise stack?
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Join high-growth engineering teams delivering sub-millisecond data isolation, compliant directory syncing, and automated billing with Prangon.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 cursor-pointer">
            <Link href="/pricing" className="flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl cursor-pointer">
            <Link href="/contact">Schedule Architecture Demo</Link>
          </Button>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC2 Type II Certified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>99.999% SLA Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>⚡️ Zero credit card required</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
