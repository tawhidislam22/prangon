import { httpClient } from "@/lib/axios/httpClient";
import { IProject } from "@/types/project.types";
import { ITask } from "@/types/task.types";
import { CreateTaskDialog } from "./components/CreateTaskDialog";
import { ProjectTabsView } from "./components/ProjectTabsView";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";

export default async function ProjectTasksPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectId: string }>;
}) {
  const { workspaceSlug, projectId } = await params;
  const userInfo = await getUserInfo();

  let project: IProject | null = null;
  try {
    const res = await httpClient.get<IProject>(`/projects/${projectId}`);
    if (res.data) {
      project = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch project details", error);
  }

  if (!project) {
    return notFound();
  }

  let tasks: ITask[] = [];
  try {
    const res = await httpClient.get<ITask[]>(`/tasks`, {
      params: { projectId },
    });
    tasks = res.data || [];
  } catch (error) {
    console.error("Failed to fetch tasks", error);
  }

  const completedCount = tasks.filter((t) => t.status === "DONE").length;
  const canManage = userInfo?.role === "SUPER_ADMIN" || true;

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        description={project.description || "Project task board and milestone tracking."}
        breadcrumbs={[
          { label: "Dashboard", href: `/w/${workspaceSlug}/dashboard` },
          { label: "Projects", href: `/w/${workspaceSlug}/projects` },
          { label: project.name },
        ]}
        badge={
          <Badge variant="outline" className="bg-cobalt/10 text-cobalt border-cobalt/20 font-semibold text-[11px]">
            {completedCount}/{tasks.length} Completed
          </Badge>
        }
        actions={
          <CreateTaskDialog projectId={projectId} />
        }
      />

      <ProjectTabsView
        workspaceSlug={workspaceSlug}
        project={project}
        initialTasks={tasks}
        canManage={canManage}
      />
    </div>
  );
}

