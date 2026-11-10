import React from 'react';
import { Check, Minus } from 'lucide-react';

const features = [
  { name: 'Workspaces', starter: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Seat Limit', starter: '3 per workspace', pro: '20 per workspace', enterprise: 'Unlimited' },
  { name: 'Data Retention', starter: '7 days', pro: '90 days', enterprise: 'Unlimited' },
  { name: 'Custom Domains', starter: false, pro: true, enterprise: true },
  { name: 'Audit Logs', starter: false, pro: false, enterprise: true },
  { name: 'SSO (SAML)', starter: false, pro: false, enterprise: true },
];

export function ComparisonTable() {
  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground w-2/5">Capability</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/5">Developer</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-primary w-1/5">Growth</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/5">Enterprise</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {features.map((feature) => (
              <tr key={feature.name} className="hover:bg-muted/30 transition-colors">
                <td className="py-4 px-6 font-semibold text-foreground">{feature.name}</td>
                <td className="py-4 px-6 text-muted-foreground">
                  {typeof feature.starter === 'boolean' ? (
                    feature.starter ? <Check className="w-4 h-4 text-emerald-400" /> : <Minus className="w-4 h-4 text-muted-foreground/40" />
                  ) : (
                    feature.starter
                  )}
                </td>
                <td className="py-4 px-6 font-medium text-foreground">
                  {typeof feature.pro === 'boolean' ? (
                    feature.pro ? <Check className="w-4 h-4 text-emerald-400" /> : <Minus className="w-4 h-4 text-muted-foreground/40" />
                  ) : (
                    feature.pro
                  )}
                </td>
                <td className="py-4 px-6 text-muted-foreground">
                  {typeof feature.enterprise === 'boolean' ? (
                    feature.enterprise ? <Check className="w-4 h-4 text-emerald-400" /> : <Minus className="w-4 h-4 text-muted-foreground/40" />
                  ) : (
                    feature.enterprise
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
