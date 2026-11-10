"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IProject } from "@/types/project.types";
import { ITask } from "@/types/task.types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Search,
  LayoutGrid,
  List as ListIcon,
  Filter,
} from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { DataTable } from "@/components/app/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface ProjectsClientViewProps {
  
  workspaceSlug?: string;
  workspaceId: string;
  projects: IProject[];
  tasksByProject: Record<string, ITask[]>;
  canManageProjects: boolean;
}

export function ProjectsClientView({
  workspaceSlug,
  workspaceId,
  projects,
  tasksByProject,
  canManageProjects,
}: ProjectsClientViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    const projectTasks = tasksByProject[project.id] || [];
    const isCompleted =
      projectTasks.length > 0 &&
      projectTasks.every((t) => t.status === "DONE");

    if (statusFilter === "ACTIVE") return !isCompleted;
    if (statusFilter === "COMPLETED") return isCompleted;
    return true;
  });

  const columns: ColumnDef<IProject>[] = [
    {
      accessorKey: "name",
      header: "Project Name",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Link
            href={`/owner/projects/${project.id}`}
            className="font-semibold text-foreground hover:text-primary flex items-center gap-2"
          >
            <FolderKanban className="size-4 text-primary shrink-0" />
            <span>{project.name}</span>
          </Link>
        );
      },
    },
    {
      id: "tasks",
      header: "Tasks Status",
      cell: ({ row }) => {
        const projectTasks = tasksByProject[row.original.id] || [];
        const completed = projectTasks.filter((t) => t.status === "DONE").length;
        const progress =
          projectTasks.length > 0
            ? Math.round((completed / projectTasks.length) * 100)
            : 0;

        return (
          <div className="space-y-1 w-36">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{completed}/{projectTasks.length} Done</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-cobalt rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Link
            href={`/owner/projects/${row.original.id}`}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            Open Board
            <ArrowRight className="size-3" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Filter & View Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 bg-card"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Status Filters */}
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/30 text-xs">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === "ALL"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === "ACTIVE"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                statusFilter === "COMPLETED"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Completed
            </button>
          </div>

          {/* Toggle Grid vs Table */}
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/30">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={`size-7 rounded-md ${
                viewMode === "grid" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("table")}
              className={`size-7 rounded-md ${
                viewMode === "table" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              <ListIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card className="border border-border bg-card shadow-xs p-8">
          <EmptyState
            icon={FolderKanban}
            title={projects.length === 0 ? "No projects yet" : "No matching projects found"}
            description={
              projects.length === 0
                ? "Create your first project to start organizing tasks, setting due dates, and collaborating with your team."
                : "Try adjusting your search query or filter status."
            }
          >
            {canManageProjects && projects.length === 0 && (
              <div className="mt-2 flex justify-center">
                <CreateProjectDialog workspaceId={workspaceId} />
              </div>
            )}
          </EmptyState>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const projectTasks = tasksByProject[project.id] || [];
            const completed = projectTasks.filter((t) => t.status === "DONE").length;
            const progress =
              projectTasks.length > 0
                ? Math.round((completed / projectTasks.length) * 100)
                : 0;

            return (
              <Link
                key={project.id}
                href={`/owner/projects/${project.id}`}
                className="group block"
              >
                <Card className="h-full border border-border bg-card hover:border-primary/40 hover:shadow-xs transition-all duration-150 flex flex-col justify-between group/card">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 group-hover/card:bg-primary group-hover/card:text-white transition-colors ring-1 ring-primary/20">
                        <FolderKanban className="size-4" />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 font-mono">
                        <Calendar className="size-3" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover/card:text-primary transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
                        {project.description || "No description provided for this project."}
                      </p>
                    </div>

                    {/* Progress Bar & Task Stats */}
                    <div className="pt-2 border-t border-border/60 space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium">
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                          <span className="tabular-nums">{completed}/{projectTasks.length}</span> tasks
                        </span>
                        <span className="font-semibold text-foreground tabular-nums">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>

                  <div className="px-5 py-3 bg-muted/20 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground group-hover/card:text-primary transition-colors">
                    <span className="font-medium">Open board</span>
                    <ArrowRight className="size-3.5 transform group-hover/card:translate-x-0.5 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <DataTable columns={columns} data={filteredProjects} pageSize={10} />
      )}
    </div>
  );
}
