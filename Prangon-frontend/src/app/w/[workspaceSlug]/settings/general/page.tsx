import { httpClient } from "@/lib/axios/httpClient";
import { GeneralSettingsForm } from "./GeneralSettingsForm";
import { PageHeader } from "@/components/app/PageHeader";
import { SettingsNavTabs } from "../components/SettingsNavTabs";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function GeneralSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
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
      if (myMembership?.role === "MEMBER" && userInfo?.role !== "SUPER_ADMIN") {
        redirect(`/w/${workspaceSlug}/dashboard`);
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
          { label: "Dashboard", href: `/w/${workspaceSlug}/dashboard` },
          { label: "Settings" },
          { label: "General" },
        ]}
      />

      <SettingsNavTabs workspaceSlug={workspaceSlug} isOwner={isOwner} />

      <GeneralSettingsForm
        workspaceSlug={workspaceSlug}
        initialName={workspaceName}
        initialLogoUrl={workspaceLogo}
      />
    </div>
  );
}
