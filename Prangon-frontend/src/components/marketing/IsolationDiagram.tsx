import React from 'react';
import { Database, ShieldCheck, Lock, Key, ArrowRight, Server } from 'lucide-react';

export function IsolationDiagram() {
  return (
    <div className="w-full py-12 flex flex-col items-center">
      <div className="w-full max-w-4xl rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-8 sm:p-10 shadow-xl space-y-8">
        {/* Architecture Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border/60 gap-4">
          <div>
            <h4 className="text-xl font-bold tracking-tight text-foreground">Zero-Leak Tenant Isolation Architecture</h4>
            <p className="text-sm text-muted-foreground">Every incoming request is verified cryptographically before reaching application storage.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>KMS Key Rotation Active</span>
          </div>
        </div>

        {/* Multi-Node Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Step 1: Ingress */}
          <div className="p-5 rounded-xl border border-border bg-card/90 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h5 className="font-semibold text-sm text-foreground">1. Edge Ingress</h5>
            <p className="text-xs text-muted-foreground font-mono">TLS 1.3 Proxy</p>
          </div>

          {/* Step 2: Resolver */}
          <div className="p-5 rounded-xl border border-primary/40 bg-primary/5 text-center space-y-2 relative">
            <div className="w-10 h-10 mx-auto rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Key className="w-5 h-5" />
            </div>
            <h5 className="font-semibold text-sm text-foreground">2. Tenant Resolver</h5>
            <p className="text-xs text-indigo-400 font-mono">Token &amp; Cookie Hash</p>
          </div>

          {/* Step 3: RLS Router */}
          <div className="p-5 rounded-xl border border-border bg-card/90 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h5 className="font-semibold text-sm text-foreground">3. RLS Shard Guard</h5>
            <p className="text-xs text-muted-foreground font-mono">Kernel Enforcement</p>
          </div>

          {/* Step 4: Storage */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/10 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h5 className="font-semibold text-sm text-foreground">4. Isolated Storage</h5>
            <p className="text-xs text-emerald-400 font-mono">AES-256 Vault</p>
          </div>
        </div>

        {/* Two Tenant Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-xl border border-border bg-muted/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-primary">WORKSPACE ALPHA</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">KEY_ID: #9A2F</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dedicated isolated shard connection pool with row-level security policy <code className="text-foreground">WHERE workspace_id = 'alpha'</code>.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-muted/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400">WORKSPACE BETA</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">KEY_ID: #7C41</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Zero possibility of cross-tenant query leakage even under concurrent peak traffic loads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
