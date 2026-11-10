import React from 'react';
import { ShieldCheck, Activity, Users, Award } from 'lucide-react';

export function Quote({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="space-y-12 my-8">
      {/* Enterprise Metrics Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">99.999%</span>
          </div>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Enterprise SLA</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Activity className="w-4 h-4" />
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">&lt; 1.2ms</span>
          </div>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">P99 Isolation Latency</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Users className="w-4 h-4" />
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">14M+</span>
          </div>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Active Workspaces</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Award className="w-4 h-4" />
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">0</span>
          </div>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Security Breaches</p>
        </div>
      </div>

      <figure className="max-w-3xl mx-auto text-center px-4">
        <blockquote className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug mb-6">
          "{quote}"
        </blockquote>
        <figcaption className="space-y-1">
          <div className="font-semibold text-base text-foreground">{author}</div>
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{role}</div>
        </figcaption>
      </figure>
    </div>
  );
}
