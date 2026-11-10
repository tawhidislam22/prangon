"use client";

import React from "react";
import { ITask } from "@/types/task.types";
import { DataTable } from "@/components/app/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";

interface ProjectListViewProps {
  workspaceSlug?: string;
  tasks: ITask[];
  onSelectTask: (taskId: string) => void;
}

export function ProjectListView({ tasks, onSelectTask }: ProjectListViewProps) {
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
        return <Badge variant="destructive" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">Urgent</Badge>;
      case "HIGH":
        return <Badge variant="warning" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">High</Badge>;
      case "MEDIUM":
        return <Badge variant="info" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">Medium</Badge>;
      default:
        return <Badge variant="neutral" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">Low</Badge>;
    }
  };

  const columns: ColumnDef<ITask>[] = [
    {
      accessorKey: "title",
      header: "Task Title",
      cell: ({ row }) => (
        <button
          onClick={() => onSelectTask(row.original.id)}
          className="text-left font-semibold text-foreground hover:text-primary flex items-center gap-2 group transition-colors"
        >
          {getStatusIcon(row.original.status)}
          <span className="group-hover:text-primary transition-colors">{row.original.title}</span>
        </button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const variant = s === "DONE" ? "success" : s === "IN_PROGRESS" ? "warning" : "neutral";
        return (
          <Badge variant={variant} className="text-[10px] font-bold px-2 py-0.5">
            {s.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => getPriorityBadge(row.original.priority),
    },
    {
      id: "assignee",
      header: "Assignee",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-medium">
          {row.original.assignee?.name || "Unassigned"}
        </span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-mono">
          {row.original.dueDate
            ? new Date(row.original.dueDate).toLocaleDateString()
            : "—"}
        </span>
      ),
    },
    {
      id: "action",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <button
            onClick={() => onSelectTask(row.original.id)}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Details
            <ArrowRight className="size-3" />
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={tasks} searchKey="title" searchPlaceholder="Search tasks..." />;
}
