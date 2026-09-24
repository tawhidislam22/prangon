import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { NotificationsList } from "./NotificationsList";
import { PageHeader } from "@/components/app/PageHeader";

export default async function NotificationsPage({
  params,
}: {
  params?: Promise<any>;
}) {
  const workspaceSlug = (await getCurrentWorkspaceSlug()) || "";

  let notifications: any[] = [];
  try {
    const res = await httpClient.get<any[]>(`/notifications`, {
      params: { workspaceSlug },
    });
    if (res.success && res.data) {
      notifications = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch notifications", error);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Notifications"
        description="Stay updated with task assignments, workspace updates, and project activity."
        breadcrumbs={[
          { label: "Dashboard", href: `/owner/dashboard` },
          { label: "Notifications" },
        ]}
      />
      <NotificationsList
        initialNotifications={notifications}
      />
    </div>
  );
}
