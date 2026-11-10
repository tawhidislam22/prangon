"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  ArrowRight,
  FolderKanban,
  ListTodo,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserTask {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: string;
  dueDate: string | null;
  project?: { id: string; name: string } | null;
}

interface MemberDashboardViewProps {
  workspaceSlug: string;
  workspaceName: string;
  userName: string;
  tasks: UserTask[];
}

type StatusFilter = "ALL" | "TODO" | "IN_PROGRESS" | "DONE";

export function MemberDashboardView({
  workspaceSlug,
  workspaceName,
  userName,
  tasks,
}: MemberDashboardViewProps) {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("ALL");

  const todoTasks = useMemo(
    () => tasks.filter((t) => t.status === "TODO"),
    [tasks]
  );
  const inProgressTasks = useMemo(
    () => tasks.filter((t) => t.status === "IN_PROGRESS"),
    [tasks]
  );
  const doneTasks = useMemo(
    () => tasks.filter((t) => t.status === "DONE"),
    [tasks]
  );
  const filteredTasks = useMemo(
    () => (activeFilter === "ALL" ? tasks : tasks.filter((t) => t.status === activeFilter)),
    [tasks, activeFilter]
  );

  const filterCards: {
    key: StatusFilter;
    label: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    ringColor: string;
  }[] = [
    {
      key: "ALL",
      label: "Total Assigned",
      count: tasks.length,
      icon: Inbox,
      color: "text-primary",
      bgColor: "bg-primary/10",
      ringColor: "ring-primary/20",
    },
    {
      key: "TODO",
      label: "To Do",
      count: todoTasks.length,
      icon: Circle,
      color: "text-slate-500",
      bgColor: "bg-slate-100 dark:bg-slate-800",
      ringColor: "ring-slate-300 dark:ring-slate-600",
    },
    {
      key: "IN_PROGRESS",
      label: "In Progress",
      count: inProgressTasks.length,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      ringColor: "ring-amber-300 dark:ring-amber-700",
    },
    {
      key: "DONE",
      label: "Completed",
      count: doneTasks.length,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      ringColor: "ring-emerald-300 dark:ring-emerald-700",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE":
        return <CheckCircle2 className="size-4 text-emerald-500" />;
      case "IN_PROGRESS":
        return <Clock className="size-4 text-amber-500" />;
      default:
        return <Circle className="size-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DONE":
        return (
          <Badge variant="success" className="text-[10px] font-bold px-2 py-0.5">
            Done
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge variant="warning" className="text-[10px] font-bold px-2 py-0.5">
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" className="text-[10px] font-bold px-2 py-0.5">
            To Do
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return (
          <Badge variant="destructive" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
            Urgent
          </Badge>
        );
      case "HIGH":
        return (
          <Badge variant="warning" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
            High
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge variant="info" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
            Medium
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
            Low
          </Badge>
        );
    }
  };

  // Progress bar width
  const totalForBar = tasks.length || 1;
  const donePercent = Math.round((doneTasks.length / totalForBar) * 100);
  const inProgressPercent = Math.round(
    (inProgressTasks.length / totalForBar) * 100
  );

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="pb-5 border-b border-border">
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-2xl font-bold font-display text-foreground tracking-tight">
            Welcome back, {userName.split(" ")[0]}
          </h1>
          <Badge
            variant="outline"
            className="text-[10px] font-semibold uppercase tracking-wide"
          >
            Member
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Your personal task hub in{" "}
          <span className="font-semibold text-foreground">{workspaceName}</span>.
          Focus on what&apos;s assigned to you.
        </p>
      </div>

      {/* ── Progress bar ───────────────────────────────── */}
      {tasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Your overall progress</span>
            <span className="font-semibold text-foreground">{donePercent}% complete</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all"
              style={{ width: `${donePercent}%` }}
            />
            <div
              className="bg-amber-400 transition-all"
              style={{ width: `${inProgressPercent}%` }}
            />
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" /> Done
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-amber-400" /> In Progress
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-muted-foreground/30" /> To Do
            </span>
          </div>
        </div>
      )}

      {/* ── Filter cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {filterCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeFilter === card.key;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => setActiveFilter(card.key)}
              className={cn(
                "p-4 rounded-xl border text-left transition-all cursor-pointer",
                isActive
                  ? `border-primary/40 bg-primary/5 shadow-xs ring-1 ${card.ringColor}`
                  : "border-border bg-card hover:border-primary/30 hover:shadow-xs"
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center mb-2",
                  card.bgColor
                )}
              >
                <Icon className={cn("size-4", card.color)} />
              </div>
              <p className="text-2xl font-bold text-foreground">{card.count}</p>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                {card.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── Task list ──────────────────────────────────── */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                {activeFilter === "ALL"
                  ? "All Assigned Tasks"
                  : activeFilter === "TODO"
                  ? "Tasks To Do"
                  : activeFilter === "IN_PROGRESS"
                  ? "Tasks In Progress"
                  : "Completed Tasks"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {filteredTasks.length === 0
                  ? "No tasks in this category."
                  : `${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""} found`}
              </CardDescription>
            </div>
            {activeFilter !== "ALL" && (
              <button
                type="button"
                onClick={() => setActiveFilter("ALL")}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Show all
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTasks.length > 0 ? (
            <div className="divide-y divide-border/60">
              {filteredTasks.map((task) => (
                <Link
                  key={task.id}
                  href={
                    task.project?.id
                      ? `/owner/projects/${task.project.id}?taskId=${task.id}`
                      : `/owner/projects`
                  }
                  className="p-4 px-5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getStatusIcon(task.status)}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-cobalt transition-colors truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                        {task.project?.name && (
                          <span className="flex items-center gap-1 font-medium">
                            <FolderKanban className="size-3" />
                            <span>{task.project.name}</span>
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3 text-muted-foreground/70" />
                            <span>
                              Due{" "}
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                    <ArrowRight className="size-3.5 text-muted-foreground/60 group-hover:text-cobalt group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center space-y-2">
              <div className="size-10 rounded-full bg-muted/60 flex items-center justify-center mx-auto">
                <ListTodo className="size-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {activeFilter === "ALL"
                  ? "No tasks assigned yet"
                  : `No ${activeFilter.toLowerCase().replace("_", " ")} tasks`}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                {activeFilter === "ALL"
                  ? "When your workspace owner or admin assigns tasks to you, they will appear here."
                  : "Try selecting a different filter above."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
