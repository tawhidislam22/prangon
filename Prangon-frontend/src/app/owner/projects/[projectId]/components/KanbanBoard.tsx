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
import { Circle, Clock, CheckCircle2, Calendar, User } from "lucide-react";

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
}[] = [
  { id: "TODO", label: "To Do", icon: Circle, color: "text-slate-500" },
  { id: "IN_PROGRESS", label: "In Progress", icon: Clock, color: "text-amber-500" },
  { id: "DONE", label: "Done", icon: CheckCircle2, color: "text-emerald-500" },
];

export function KanbanBoard({
  tasks,
  onSelectTask,
  onStatusChange,
}: KanbanBoardProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">Urgent</span>;
      case "HIGH":
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-700">High</span>;
      case "MEDIUM":
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">Medium</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">Low</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const Icon = column.icon;

        return (
          <div
            key={column.id}
            className="bg-muted/30 rounded-xl p-4 border border-border flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Icon className={`size-4 ${column.color}`} />
                <h3 className="font-bold font-display text-sm text-foreground">{column.label}</h3>
              </div>
              <Badge
                variant="outline"
                className="bg-card border-border text-foreground text-xs px-2 py-0.5 font-semibold"
              >
                {columnTasks.length}
              </Badge>
            </div>

            {/* Task list */}
            <div className="space-y-3 flex-1">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  onClick={() => onSelectTask(task.id)}
                  className="border border-border bg-card hover:border-cobalt/40 hover:shadow-sm transition-all rounded-lg cursor-pointer group"
                >
                  <CardContent className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      {getPriorityBadge(task.priority)}

                      {/* Status Selector */}
                      <Select
                        value={task.status}
                        onValueChange={(val) => onStatusChange(task.id, val as TaskStatus)}
                      >
                        <SelectTrigger className="h-6 w-auto border-none shadow-none text-[11px] font-medium text-muted-foreground hover:text-foreground px-1.5 focus:ring-0">
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
                      <h4 className="font-bold text-foreground text-xs line-clamp-2 group-hover:text-cobalt transition-colors">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                      {task.dueDate ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 text-muted-foreground" />
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span />
                      )}

                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <User className="size-3" />
                        {task.assignee?.name || "Unassigned"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {columnTasks.length === 0 && (
                <div className="py-12 border-2 border-dashed border-border/80 rounded-lg text-center text-xs text-muted-foreground">
                  No tasks in {column.label}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
