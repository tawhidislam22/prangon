"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TaskStatusChartProps {
  workspaceSlug?: string;
  statusCounts: {
    todo: number;
    inProgress: number;
    done: number;
    total: number;
  };
}

const COLORS = {
  todo: "#94a3b8", // slate-400
  inProgress: "#f59e0b", // amber-500
  done: "#10b981", // emerald-500
};

export function TaskStatusChart({ statusCounts }: TaskStatusChartProps) {
  const data = [
    { name: "To Do", value: statusCounts.todo, color: COLORS.todo },
    { name: "In Progress", value: statusCounts.inProgress, color: COLORS.inProgress },
    { name: "Completed", value: statusCounts.done, color: COLORS.done },
  ];

  const hasTasks = statusCounts.total > 0;
  const completionRate = hasTasks ? Math.round((statusCounts.done / statusCounts.total) * 100) : 0;

  return (
    <Card className="border border-border bg-card shadow-2xs">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            Task Status Breakdown
          </CardTitle>
          {hasTasks && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40 font-mono">
              {completionRate}% Done
            </span>
          )}
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Workspace task completion overview
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="h-[200px] w-full flex items-center justify-center relative">
          {hasTasks ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `${value} tasks`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "var(--foreground)",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold tracking-tight text-foreground font-sans tabular-nums">{statusCounts.total}</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Total</span>
              </div>
            </>
          ) : (
            <div className="text-center text-xs text-muted-foreground">
              No tasks created yet in this workspace
            </div>
          )}
        </div>

        {/* Legend & Breakdown */}
        <div className="pt-3 border-t border-border/70 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="space-y-0.5 p-1.5 rounded-md hover:bg-muted/40 transition-colors">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-slate-400" />
              <span>To Do</span>
            </div>
            <p className="font-bold text-foreground tabular-nums text-sm">{statusCounts.todo}</p>
          </div>
          <div className="space-y-0.5 p-1.5 rounded-md hover:bg-muted/40 transition-colors">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>In Progress</span>
            </div>
            <p className="font-bold text-foreground tabular-nums text-sm">{statusCounts.inProgress}</p>
          </div>
          <div className="space-y-0.5 p-1.5 rounded-md hover:bg-muted/40 transition-colors">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Done</span>
            </div>
            <p className="font-bold text-foreground tabular-nums text-sm">{statusCounts.done}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
