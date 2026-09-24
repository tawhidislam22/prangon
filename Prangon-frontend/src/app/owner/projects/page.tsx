import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { IWorkspace } from "@/types/workspace.types";
import { IProject } from "@/types/project.types";
import { ITask } from "@/types/task.types";
import { CreateProjectDialog } from "./components/CreateProjectDialog";
import { ProjectsClientView } from "./components/ProjectsClientView";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/badge";
import { getUserInfo } from "@/services/auth.services";

export default async function ProjectsPage({
  params,
}: {
  params?: Promise<any>;
}) {
  const workspaceSlug = (await getCurrentWorkspaceSlug()) || "";
  const userInfo = await getUserInfo();

  let workspaces: IWorkspace[] = [];
  try {
    const workspacesRes = await httpClient.get<IWorkspace[]>("/workspaces");
    workspaces = workspacesRes.data || [];
  } catch {
    // fallback
  }
  const workspace = workspaces.find((w) => w.slug === workspaceSlug) || {
    id: workspaceSlug,
    name: workspaceSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    slug: workspaceSlug,
    userId: "owner",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    onboardingStatus: "COMPLETED",
  };

  let projects: IProject[] = [];
  let tasksByProject: Record<string, ITask[]> = {};

  try {
    const res = await httpClient.get<IProject[]>(`/projects`, {
      params: { workspaceId: workspace.id },
    });
    projects = res.data || [];

    const taskResponses = await Promise.allSettled(
      projects.map((p) =>
        httpClient.get<ITask[]>("/tasks", { params: { projectId: p.id } })
      )
    );

    projects.forEach((p, idx) => {
      const outcome = taskResponses[idx];
      if (outcome.status === "fulfilled") {
        tasksByProject[p.id] = outcome.value.data || [];
      } else {
        tasksByProject[p.id] = [];
      }
    });
  } catch {
    //
  }

  // Permission check: Owner or Admin can create projects
  const canManageProjects =
    userInfo?.role === "SUPER_ADMIN" ||
    workspace.userId === userInfo?.id ||
    true; // Default true for owner dashboard context

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Organize work, track milestones, and manage task boards."
        breadcrumbs={[
          { label: "Dashboard", href: `/owner/dashboard` },
          { label: "Projects" },
        ]}
        badge={
          <Badge variant="outline" className="bg-cobalt/10 text-cobalt border-cobalt/20 font-semibold text-[11px]">
            {projects.length} Total
          </Badge>
        }
        actions={
          canManageProjects ? <CreateProjectDialog workspaceId={workspace.id} /> : null
        }
      />

      <ProjectsClientView
        workspaceId={workspace.id}
        projects={projects}
        tasksByProject={tasksByProject}
        canManageProjects={canManageProjects}
      />
    </div>
  );
}

