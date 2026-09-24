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

  return (
    <Card className="border border-border bg-card shadow-xs">
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <Clock className="size-4 text-cobalt" />
          Task Status Breakdown
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Workspace task completion overview
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="h-[200px] w-full flex items-center justify-center">
          {hasTasks ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
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
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-xs text-muted-foreground">
              No tasks created yet in this workspace
            </div>
          )}
        </div>

        {/* Legend & Breakdown */}
        <div className="pt-3 border-t border-border grid grid-cols-3 gap-2 text-center text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-slate-400" />
              <span>To Do</span>
            </div>
            <p className="font-bold text-foreground">{statusCounts.todo}</p>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>Progress</span>
            </div>
            <p className="font-bold text-foreground">{statusCounts.inProgress}</p>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Done</span>
            </div>
            <p className="font-bold text-foreground">{statusCounts.done}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
