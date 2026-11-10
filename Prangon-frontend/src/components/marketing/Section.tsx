import React from "react";
import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  variant?: "paper" | "ink" | "elevated";
};

export function Section({ variant = "paper", className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-24 relative overflow-hidden transition-colors",
        variant === "ink"
          ? "bg-[#0B0F19] text-slate-100 border-y border-white/[0.08]"
          : variant === "elevated"
          ? "bg-slate-900/50 backdrop-blur-md text-foreground border-y border-border"
          : "bg-background text-foreground border-y border-border/60",
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 sm:px-6 xl:px-12 max-w-[1320px] relative z-10">
        {children}
      </div>
    </section>
  );
}
