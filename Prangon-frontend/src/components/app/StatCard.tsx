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
    <Card className={cn("border border-line bg-white shadow-xs hover:shadow-sm transition-shadow", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-graphite uppercase tracking-wider">{title}</span>
          <div className="p-2 rounded-lg bg-ink/5 text-graphite">
            <Icon className="size-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-ink tracking-tight">{value}</span>
          {change && (
            <span
              className={cn(
                "inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded",
                change.trend === "up" && "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300",
                change.trend === "down" && "text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300",
                change.trend === "neutral" && "text-slate-600 bg-slate-100 dark:bg-slate-800"
              )}
            >
              {change.trend === "up" && <ArrowUpRight className="size-3 mr-0.5" />}
              {change.trend === "down" && <ArrowDownRight className="size-3 mr-0.5" />}
              {change.value}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-xs text-graphite/80">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}