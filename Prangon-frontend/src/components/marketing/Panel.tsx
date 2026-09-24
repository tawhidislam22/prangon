import React from "react";
import { cn } from "@/lib/utils";

type PanelProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "paper" | "ink";
};

export function Panel({ variant = "paper", className, children, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "border p-8 relative",
        variant === "ink" ? "border-line-dark bg-ink text-paper" : "border-line bg-paper text-ink",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
