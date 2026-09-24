import React from "react";
import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  variant?: "paper" | "ink";
};

export function Section({ variant = "paper", className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "py-12 md:py-16",
        variant === "ink" ? "bg-ink text-paper border-y border-line-dark" : "bg-paper text-graphite border-y border-line",
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 sm:px-6 xl:px-12 max-w-[1400px]">
        {children}
      </div>
    </section>
  );
}
