import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { GeneralSettingsForm } from "./GeneralSettingsForm";
import { PageHeader } from "@/components/app/PageHeader";
import { SettingsNavTabs } from "../components/SettingsNavTabs";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function GeneralSettingsPage({
  params,
}: {
  params?: Promise<any>;
}) {
  const workspaceSlug = (await getCurrentWorkspaceSlug()) || "";
  const userInfo = await getUserInfo();

  let workspaceName = workspaceSlug;
  let workspaceLogo = "";
  let isOwner = false;

  try {
    const [wsRes, memRes] = await Promise.allSettled([
      httpClient.get<any>(`/workspaces/${workspaceSlug}`),
      httpClient.get<any[]>("/workspace-members", { params: { workspaceSlug } }),
    ]);

    if (wsRes.status === "fulfilled" && wsRes.value.data) {
      workspaceName = wsRes.value.data.name || workspaceSlug;
      workspaceLogo = wsRes.value.data.logoUrl || "";
    }

    if (memRes.status === "fulfilled") {
      const members = memRes.value.data || [];
      const myMembership = members.find(
        (m: any) => m.userId === userInfo?.id || m.user?.email === userInfo?.email
      );
      if (myMembership && myMembership.role !== "OWNER" && userInfo?.role !== "SUPER_ADMIN") {
        redirect(`/owner/settings/security`);
      }
      isOwner = myMembership?.role === "OWNER" || userInfo?.role === "SUPER_ADMIN";
    }
  } catch (error) {
    console.error("Failed to fetch workspace", error);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Workspace Settings"
        description="Configure workspace identity, roles, and administrative controls."
        breadcrumbs={[
          { label: "Dashboard", href: `/owner/dashboard` },
          { label: "Settings" },
          { label: "General" },
        ]}
      />

      <SettingsNavTabs isOwner={isOwner} />

      <GeneralSettingsForm
        initialName={workspaceName}
        initialLogoUrl={workspaceLogo}
      />
    </div>
  );
}
