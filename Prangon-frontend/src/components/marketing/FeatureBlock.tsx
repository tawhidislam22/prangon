"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeatureBlockProps {
  tag?: string;
  title: string;
  description: string;
  highlights?: string[];
  imageSrc?: string;
  imageAlt?: string;
  reverse?: boolean;
  codeSnippet?: string;
}

export function FeatureBlock({
  tag = "ENTERPRISE PRIMITIVE",
  title,
  description,
  highlights = [
    "Sub-millisecond cryptographic tenant resolution",
    "Isolated connection pools & row-level security",
    "Automated audit logging & SOC2 compliance stream"
  ],
  imageSrc,
  imageAlt = 'Feature illustration',
  reverse = false,
  codeSnippet
}: FeatureBlockProps) {
  return (
    <div className={`flex flex-col lg:flex-row gap-12 lg:gap-16 items-center py-20 md:py-28 border-b border-border/60 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <motion.div 
        className="flex-1 space-y-6"
        initial={{ opacity: 0, x: reverse ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <span>{tag}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">{title}</h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>

        <ul className="space-y-3 pt-2">
          {highlights.map((h, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="pt-4">
          <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <span>Explore technical specifications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      <motion.div 
        className="flex-1 w-full"
        initial={{ opacity: 0, x: reverse ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card/80 backdrop-blur-md p-6 sm:p-8">
          {codeSnippet ? (
            <div className="font-mono text-xs text-slate-300 bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto leading-relaxed">
              <code>{codeSnippet}</code>
            </div>
          ) : imageSrc ? (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/60">
              <img 
                src={imageSrc} 
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/30 to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-xl bg-slate-950 p-6 flex flex-col justify-between border border-slate-800 text-slate-300">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>telemetry_stream.log</span>
                <span className="text-emerald-400">STATUS: ACTIVE</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <p className="text-indigo-400">&gt; verifying tenant context: workspace_id='acme-enterprise'</p>
                <p className="text-slate-400">&gt; applying cryptographic RLS policy [tenant_hash=0x8f2a]</p>
                <p className="text-emerald-400">&gt; 0ms latency penalty. Connection pool healthy.</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Continuous Row-Level Guard Enforced</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
