"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Calendar, ArrowRight, FolderKanban } from "lucide-react";

interface UserTask {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: string;
  dueDate: string | null;
  project?: {
    id: string;
    name: string;
  } | null;
}

interface TaskListProps {
  
  workspaceSlug?: string;
  tasks: UserTask[];
}

export function TaskList({ workspaceSlug, tasks }: TaskListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE":
        return <CheckCircle2 className="size-3.5 text-emerald-500" />;
      case "IN_PROGRESS":
        return <Clock className="size-3.5 text-amber-500" />;
      default:
        return <Circle className="size-3.5 text-slate-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <Badge variant="destructive" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">Urgent</Badge>;
      case "HIGH":
        return <Badge variant="warning" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">High</Badge>;
      case "MEDIUM":
        return <Badge variant="info" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">Medium</Badge>;
      default:
        return <Badge variant="neutral" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">Low</Badge>;
    }
  };

  return (
    <Card className="border border-border bg-card shadow-xs">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">Your Assigned Tasks</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Tasks assigned to you across all projects in this workspace
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-[11px] font-semibold">
            {tasks.length} Assigned
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {tasks.length > 0 ? (
          <div className="divide-y divide-border/60">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={
                  task.project?.id
                    ? `/owner/projects/${task.project.id}?taskId=${task.id}`
                    : `/owner/projects`
                }
                className="p-3.5 px-5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getStatusIcon(task.status)}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                      {task.project?.name && (
                        <span className="flex items-center gap-1 font-medium">
                          <FolderKanban className="size-3" />
                          <span>{task.project.name}</span>
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 text-muted-foreground/70" />
                          <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {getPriorityBadge(task.priority)}
                  <ArrowRight className="size-3.5 text-muted-foreground/60 group-hover:text-cobalt group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground">
            You have no tasks assigned to you in this workspace.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
