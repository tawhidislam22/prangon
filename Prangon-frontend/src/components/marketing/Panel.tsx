import React from "react";
import { cn } from "@/lib/utils";

type PanelProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "paper" | "ink" | "glass";
};

export function Panel({ variant = "paper", className, children, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-8 relative transition-all duration-300",
        variant === "ink"
          ? "border-white/10 bg-slate-900/60 backdrop-blur-md text-slate-100 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          : variant === "glass"
          ? "border-border/80 bg-card/60 backdrop-blur-md text-card-foreground hover:border-primary/30"
          : "border-border bg-card text-card-foreground shadow-xs hover:border-primary/40 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
