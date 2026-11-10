import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  change,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("border border-border bg-card text-card-foreground shadow-2xs hover:shadow-xs transition-all duration-150 group", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
          <div className="p-2 rounded-md bg-muted/60 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
            <Icon className="size-4" />
          </div>
        </div>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-sans tabular-nums">{value}</span>
          {change && (
            <span
              className={cn(
                "inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded-full border",
                change.trend === "up" && "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
                change.trend === "down" && "text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",
                change.trend === "neutral" && "text-slate-600 bg-slate-100 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
              )}
            >
              {change.trend === "up" && <ArrowUpRight className="size-3 mr-0.5" />}
              {change.trend === "down" && <ArrowDownRight className="size-3 mr-0.5" />}
              {change.value}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground leading-tight">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}