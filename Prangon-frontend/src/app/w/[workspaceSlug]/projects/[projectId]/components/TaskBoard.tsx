"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ITask, TaskStatus } from "@/types/task.types";
import { Card, CardContent } from "@/components/ui/card";
import { updateTaskStatus } from "@/services/task.services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Circle, Clock, CheckCircle2, MoreVertical, Calendar } from "lucide-react";

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

export function TaskBoard({ initialTasks }: { initialTasks: ITask[] }) {
  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  const router = useRouter();

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const res = await updateTaskStatus(taskId, newStatus);
    if (!res.success) {
      setTasks(initialTasks);
      console.error(res.message);
    } else {
      router.refresh();
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">Urgent</span>;
      case "HIGH":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-700">High</span>;
      case "MEDIUM":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">Low</span>;
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
            className="bg-muted/30 rounded-xl p-4 border border-line flex flex-col min-h-[550px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-line/60">
              <div className="flex items-center gap-2">
                <Icon className={`size-4 ${column.color}`} />
                <h3 className="font-bold font-display text-sm text-ink">{column.label}</h3>
              </div>
              <Badge
                variant="outline"
                className="bg-white border-line text-graphite text-xs px-2 py-0.5 font-semibold"
              >
                {columnTasks.length}
              </Badge>
            </div>

            {/* Task list */}
            <div className="space-y-3 flex-1">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  className="border border-line bg-white hover:border-cobalt/40 hover:shadow-sm transition-all rounded-lg"
                >
                  <CardContent className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      {getPriorityBadge(task.priority)}

                      {/* Status Selector */}
                      <Select
                        value={task.status}
                        onValueChange={(val) =>
                          handleStatusChange(task.id, val as TaskStatus)
                        }
                      >
                        <SelectTrigger className="h-6 w-auto border-none shadow-none text-[11px] font-medium text-graphite hover:text-ink px-1.5 focus:ring-0">
                          <SelectValue placeholder="Move" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          <SelectItem value="TODO">Move to To Do</SelectItem>
                          <SelectItem value="IN_PROGRESS">Move to In Progress</SelectItem>
                          <SelectItem value="DONE">Move to Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="font-bold text-ink text-xs line-clamp-2">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] text-graphite line-clamp-2 mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {task.dueDate && (
                      <div className="pt-2 border-t border-line/50 flex items-center justify-between text-[10px] text-graphite">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 text-muted-foreground" />
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {columnTasks.length === 0 && (
                <div className="py-12 border-2 border-dashed border-line/80 rounded-lg text-center text-xs text-graphite">
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
