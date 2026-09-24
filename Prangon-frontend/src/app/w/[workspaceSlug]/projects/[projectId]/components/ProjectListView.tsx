"use client";

import React from "react";
import { ITask } from "@/types/task.types";
import { DataTable } from "@/components/app/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";

interface ProjectListViewProps {
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
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">Urgent</span>;
      case "HIGH":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 text-orange-700">High</span>;
      case "MEDIUM":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">Low</span>;
    }
  };

  const columns: ColumnDef<ITask>[] = [
    {
      accessorKey: "title",
      header: "Task Title",
      cell: ({ row }) => (
        <button
          onClick={() => onSelectTask(row.original.id)}
          className="text-left font-semibold text-foreground hover:text-cobalt flex items-center gap-2"
        >
          {getStatusIcon(row.original.status)}
          <span>{row.original.title}</span>
        </button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[10px] font-semibold">
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
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
        <span className="text-muted-foreground text-xs">
          {row.original.assignee?.name || "Unassigned"}
        </span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
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
            className="text-xs font-semibold text-cobalt hover:underline inline-flex items-center gap-1"
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
