import Link from "next/link";
import { FolderKanban, ListChecks, Users, CreditCard, Plus, ArrowRight } from "lucide-react";
import { httpClient } from "@/lib/axios/httpClient";
import { IWorkspace } from "@/types/workspace.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Resource = "projects" | "tasks" | "team" | "billing";

const pageContent = {
  projects: { title: "Projects", description: "Plan and organize projects across all your workspaces.", empty: "Create a workspace to start your first project.", action: "View projects", icon: FolderKanban },
  tasks: { title: "My tasks", description: "Open a workspace to review tasks grouped by project.", empty: "Create a workspace and project to start tracking tasks.", action: "View tasks", icon: ListChecks },
  team: { title: "Team members", description: "Manage the people collaborating in each workspace.", empty: "Create a workspace before inviting team members.", action: "Manage team", icon: Users },
  billing: { title: "Billing & subscription", description: "Review billing and subscription settings for your workspaces.", empty: "Create a workspace to configure a subscription.", action: "Open workspace", icon: CreditCard },
} as const;

function resourceHref(resource: Resource, workspace: IWorkspace) {
  if (resource === "team") return `/w/${workspace.slug}/members`;
  if (resource === "projects" || resource === "tasks") return `/w/${workspace.slug}/projects`;
  return `/w/${workspace.slug}/dashboard`;
}

export async function WorkspaceResourceOverview({ resource }: { resource: Resource }) {
  const content = pageContent[resource];
  const Icon = content.icon;
  let workspaces: IWorkspace[] = [];

  try {
    const response = await httpClient.get<IWorkspace[]>("/workspaces");
    workspaces = response.data || [];
  } catch {
    // The empty state also provides a safe fallback if the API is unavailable.
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{content.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{content.description}</p>
        </div>
        <Button asChild><Link href="/workspaces/create"><Plus className="size-4" />New workspace</Link></Button>
      </div>

      {workspaces.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex min-h-72 flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="size-7" /></div>
            <h2 className="text-lg font-semibold">No workspaces yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">{content.empty}</p>
            <Button asChild className="mt-5"><Link href="/workspaces/create"><Plus className="size-4" />Create workspace</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="group transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></div>
                <CardTitle>{workspace.name}</CardTitle>
                <CardDescription>/{workspace.slug}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link href={resourceHref(resource, workspace)}>{content.action}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
