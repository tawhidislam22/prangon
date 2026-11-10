import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface IntegrationCardProps {
  name: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
  status?: string;
}

export function IntegrationCard({ name, description, category, icon, status = "Verified" }: IntegrationCardProps) {
  return (
    <div className="group rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-6 flex flex-col justify-between hover:border-primary/40 hover:bg-card/90 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            {icon || <div className="w-6 h-6 bg-primary/20 rounded-lg"></div>}
          </div>
          <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border">
            {category}
          </span>
        </div>
        <h3 className="text-lg font-bold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{status}</span>
        </div>
        <Link href="/docs/integrations" className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors inline-flex items-center gap-1">
          <span>Docs</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
