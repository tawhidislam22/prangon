"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { IProject } from "@/types/project.types";
import { ITask, TaskStatus } from "@/types/task.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "./KanbanBoard";
import { ProjectListView } from "./ProjectListView";
import { ProjectSettingsTab } from "./ProjectSettingsTab";
import { TaskDetailSheet } from "./TaskDetailSheet";
import { updateTaskStatus } from "@/services/task.services";
import { LayoutGrid, List, Settings } from "lucide-react";
import { toast } from "sonner";

interface ProjectTabsViewProps {
  
  workspaceSlug?: string;
  project: IProject;
  initialTasks: ITask[];
  canManage: boolean;
}

export function ProjectTabsView({
  workspaceSlug,
  project,
  initialTasks,
  canManage,
}: ProjectTabsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    searchParams.get("taskId")
  );

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    const taskIdParam = searchParams.get("taskId");
    setSelectedTaskId(taskIdParam);
  }, [searchParams]);

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("taskId", taskId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCloseDetail = () => {
    setSelectedTaskId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("taskId");
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false,
    });
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const res = await updateTaskStatus(taskId, newStatus);
    if (!res.success) {
      setTasks(initialTasks);
      toast.error(res.message || "Failed to update task status");
    } else {
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="board" className="space-y-6">
        <TabsList className="bg-muted/40 p-1 border border-border rounded-lg">
          <TabsTrigger value="board" className="text-xs font-semibold gap-1.5 data-[state=active]:bg-card">
            <LayoutGrid className="size-3.5" />
            <span>Board</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="text-xs font-semibold gap-1.5 data-[state=active]:bg-card">
            <List className="size-3.5" />
            <span>List</span>
          </TabsTrigger>
          {canManage && (
            <TabsTrigger value="settings" className="text-xs font-semibold gap-1.5 data-[state=active]:bg-card">
              <Settings className="size-3.5" />
              <span>Settings</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="board" className="mt-0 focus-visible:outline-none">
          <KanbanBoard
            tasks={tasks}
            onSelectTask={handleSelectTask}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-0 focus-visible:outline-none">
          <ProjectListView
            tasks={tasks}
            onSelectTask={handleSelectTask}
          />
        </TabsContent>

        {canManage && (
          <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
            <ProjectSettingsTab
              project={project}
              canManage={canManage}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Slide-over Task Detail Drawer */}
      <TaskDetailSheet
        projectId={project.id}
        taskId={selectedTaskId}
        onClose={handleCloseDetail}
        onTaskUpdated={() => router.refresh()}
      />
    </div>
  );
}
