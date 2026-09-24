import React from "react";

interface LegalSectionProps {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ id, number, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-semibold text-ink mb-4 font-display">
        {number}. {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
