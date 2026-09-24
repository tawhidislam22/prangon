import React from 'react';
import { Panel } from './Panel';
import { Database, Server, Shield } from 'lucide-react';

export function IsolationDiagram() {
  return (
    <div className="w-full py-12 flex flex-col items-center">
      <div className="flex flex-col md:flex-row items-stretch justify-center w-full max-w-4xl gap-8">
        <Panel className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-paper border-line">
          <Server className="w-8 h-8 text-ink mb-4" strokeWidth={1.5} />
          <h4 className="font-display text-lg text-ink mb-2">Tenant A</h4>
          <p className="font-sans text-sm text-graphite">Isolated compute resources.</p>
        </Panel>
        
        <div className="hidden md:flex flex-col justify-center items-center px-4">
          <Shield className="w-6 h-6 text-ink/50" />
          <div className="w-px h-16 bg-line-dark my-2"></div>
        </div>
        <div className="md:hidden flex justify-center items-center py-4">
          <Shield className="w-6 h-6 text-ink/50" />
          <div className="h-px w-16 bg-line-dark mx-2"></div>
        </div>

        <Panel className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-paper border-line">
          <Database className="w-8 h-8 text-ink mb-4" strokeWidth={1.5} />
          <h4 className="font-display text-lg text-ink mb-2">Tenant B</h4>
          <p className="font-sans text-sm text-graphite">Isolated data storage.</p>
        </Panel>
      </div>
      <div className="mt-8 font-sans text-sm text-graphite max-w-lg text-center">
        Complete logical and physical separation ensures data from Tenant A can never leak to Tenant B.
      </div>
    </div>
  );
}
