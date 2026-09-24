import React from 'react';
import { Panel } from './Panel';
import Link from 'next/link';

interface IntegrationCardProps {
  name: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
}

export function IntegrationCard({ name, description, category, icon }: IntegrationCardProps) {
  return (
    <Panel className="flex flex-col p-6 hover:bg-ink/5 transition-colors group cursor-pointer border-t-0 border-l-0 bg-paper">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 flex items-center justify-center border border-line bg-paper">
          {icon || <div className="w-6 h-6 bg-line-dark/20 rounded-sm"></div>}
        </div>
        <span className="font-sans text-xs tracking-wider text-graphite uppercase">{category}</span>
      </div>
      <h3 className="font-display text-xl text-ink mb-2 group-hover:underline underline-offset-4 decoration-line-dark">{name}</h3>
      <p className="font-sans text-sm text-graphite line-clamp-2">{description}</p>
    </Panel>
  );
}
