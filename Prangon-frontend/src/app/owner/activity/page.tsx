import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/badge";
import { ActivityFeedView } from "./components/ActivityFeedView";

export default async function WorkspaceActivityPage({
  params,
}: {
  params?: Promise<any>;
}) {
  const workspaceSlug = (await getCurrentWorkspaceSlug()) || "";

  let workspace: any = null;
  let activities: any[] = [];

  try {
    const wsRes = await httpClient.get<any>(`/workspaces/${workspaceSlug}`);
    workspace = wsRes.data;

    if (workspace?.id) {
      const actRes = await httpClient.get<any[]>(
        `/activity-logs/${workspace.id}/activities`
      );
      activities = actRes.data || [];
    }
  } catch {
    //
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Activity Log"
        description="Comprehensive audit trail of all actions, updates, and events in this workspace."
        breadcrumbs={[
          { label: "Dashboard", href: `/owner/dashboard` },
          { label: "Activity Log" },
        ]}
        badge={
          <Badge variant="outline" className="border-line text-muted-foreground text-[11px] font-semibold">
            {activities.length} Events
          </Badge>
        }
      />

      <ActivityFeedView initialActivities={activities} />
    </div>
  );
}
