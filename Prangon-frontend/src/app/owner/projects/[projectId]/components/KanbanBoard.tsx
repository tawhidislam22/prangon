"use client";

import React from "react";
import { ITask, TaskStatus } from "@/types/task.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Circle, Clock, CheckCircle2, Calendar, User, AlertCircle, Flame, ChevronUp, Minus } from "lucide-react";

interface KanbanBoardProps {
  workspaceSlug?: string;
  tasks: ITask[];
  onSelectTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const COLUMNS: {
  id: TaskStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
}[] = [
  { id: "TODO", label: "To Do", icon: Circle, color: "text-slate-500", badgeBg: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300" },
  { id: "IN_PROGRESS", label: "In Progress", icon: Clock, color: "text-amber-500", badgeBg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" },
  { id: "DONE", label: "Done", icon: CheckCircle2, color: "text-emerald-500", badgeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
];

export function KanbanBoard({
  tasks,
  onSelectTask,
  onStatusChange,
}: KanbanBoardProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return (
          <Badge variant="destructive" className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 gap-1">
            <Flame className="size-3" />
            <span>Urgent</span>
          </Badge>
        );
      case "HIGH":
        return (
          <Badge variant="warning" className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 gap-1">
            <ChevronUp className="size-3" />
            <span>High</span>
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge variant="info" className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 gap-1">
            <Minus className="size-3" />
            <span>Medium</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5">
            Low
          </Badge>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const Icon = column.icon;

        return (
          <div
            key={column.id}
            className="bg-muted/25 dark:bg-zinc-900/30 rounded-xl p-3.5 border border-border/80 flex flex-col min-h-[550px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70">
              <div className="flex items-center gap-2">
                <Icon className={`size-4 ${column.color}`} />
                <h3 className="font-semibold text-sm text-foreground">{column.label}</h3>
              </div>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold border border-border/50 ${column.badgeBg}`}
              >
                {columnTasks.length}
              </span>
            </div>

            {/* Task list */}
            <div className="space-y-2.5 flex-1">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  onClick={() => onSelectTask(task.id)}
                  className="border border-border/80 bg-card hover:border-primary/50 hover:shadow-2xs transition-all duration-150 rounded-lg cursor-pointer group"
                >
                  <CardContent className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      {getPriorityBadge(task.priority)}

                      {/* Status Selector */}
                      <Select
                        value={task.status}
                        onValueChange={(val) => onStatusChange(task.id, val as TaskStatus)}
                      >
                        <SelectTrigger className="h-6 w-auto border-none shadow-none text-[11px] font-medium text-muted-foreground hover:text-foreground px-1.5 focus:ring-0 bg-muted/40 rounded">
                          <SelectValue placeholder="Move" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          <SelectItem value="TODO">To Do</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="DONE">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground text-xs leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                      {task.dueDate ? (
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="size-3 text-muted-foreground/70" />
                          <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                        </span>
                      ) : (
                        <span />
                      )}

                      <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                        <div className="size-4 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                          {task.assignee?.name ? task.assignee.name.charAt(0).toUpperCase() : <User className="size-2.5" />}
                        </div>
                        <span className="truncate max-w-[90px]">{task.assignee?.name || "Unassigned"}</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {columnTasks.length === 0 && (
                <div className="py-14 border border-dashed border-border/80 rounded-lg text-center text-xs text-muted-foreground bg-card/40">
                  <p className="font-medium">No tasks in {column.label}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">Move or create tasks here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
