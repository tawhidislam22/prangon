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
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left font-sans border-collapse">
        <thead>
          <tr className="border-b border-line">
            <th className="py-4 px-6 font-medium text-ink w-2/5">Feature</th>
            <th className="py-4 px-6 font-medium text-ink w-1/5">Starter</th>
            <th className="py-4 px-6 font-medium text-ink w-1/5">Pro</th>
            <th className="py-4 px-6 font-medium text-ink w-1/5">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, idx) => (
            <tr key={feature.name} className="border-b border-line last:border-0 hover:bg-ink/5 transition-colors">
              <td className="py-4 px-6 text-ink">{feature.name}</td>
              <td className="py-4 px-6 text-graphite">
                {typeof feature.starter === 'boolean' ? (
                  feature.starter ? <Check className="w-5 h-5 text-ink" /> : <Minus className="w-5 h-5 text-line-dark" />
                ) : (
                  feature.starter
                )}
              </td>
              <td className="py-4 px-6 text-graphite">
                {typeof feature.pro === 'boolean' ? (
                  feature.pro ? <Check className="w-5 h-5 text-ink" /> : <Minus className="w-5 h-5 text-line-dark" />
                ) : (
                  feature.pro
                )}
              </td>
              <td className="py-4 px-6 text-graphite">
                {typeof feature.enterprise === 'boolean' ? (
                  feature.enterprise ? <Check className="w-5 h-5 text-ink" /> : <Minus className="w-5 h-5 text-line-dark" />
                ) : (
                  feature.enterprise
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
