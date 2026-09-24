import React from 'react';
import { Panel } from './Panel';
import { Layers, Shield, Zap, Globe, Cpu, Lock } from 'lucide-react';

const features = [
  {
    name: 'Multi-Tenant by Default',
    description: 'Built from the ground up for SaaS. Securely partition data between workspaces.',
    icon: Layers,
  },
  {
    name: 'Enterprise Security',
    description: 'SOC2 compliant infrastructure with row-level security and end-to-end encryption.',
    icon: Shield,
  },
  {
    name: 'Lightning Fast',
    description: 'Edge-rendered pages and globally distributed databases ensure sub-50ms latency.',
    icon: Zap,
  },
  {
    name: 'Global Edge Network',
    description: 'Deploy to 35+ regions worldwide with a single click. Keep data close to your users.',
    icon: Globe,
  },
  {
    name: 'Serverless Compute',
    description: 'Scale automatically without managing infrastructure. Pay only for what you use.',
    icon: Cpu,
  },
  {
    name: 'Role-Based Access',
    description: 'Granular permissions and custom roles out of the box. Secure by design.',
    icon: Lock,
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-line">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Panel key={index} className="border-t-0 border-l-0 p-8 h-full flex flex-col items-start bg-paper">
            <div className="mb-6 p-3 border border-line bg-ink/5 text-ink">
              <Icon className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-xl text-ink mb-3">{feature.name}</h3>
            <p className="font-sans text-graphite leading-relaxed">
              {feature.description}
            </p>
          </Panel>
        );
      })}
    </div>
  );
}
