import React from 'react';

export function TrustBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center px-3 py-1 border border-line bg-paper/50 backdrop-blur-sm mb-8">
      <span className="font-sans text-sm text-graphite font-medium tracking-wide uppercase">
        {children}
      </span>
    </div>
  );
}
