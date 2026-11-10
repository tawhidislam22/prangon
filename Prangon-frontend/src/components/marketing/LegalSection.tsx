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
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-4">
        {number}. {title}
      </h2>
      <div className="space-y-4 text-muted-foreground">{children}</div>
    </section>
  );
}
