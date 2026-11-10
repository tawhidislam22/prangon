import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function TrustBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/25 bg-primary/10 text-indigo-400 mb-6 backdrop-blur-sm">
      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
      <span className="font-mono text-xs font-semibold tracking-wider uppercase">
        {children}
      </span>
    </div>
  );
}
