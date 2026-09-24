import { httpClient } from "@/lib/axios/httpClient";
import { PageHeader } from "@/components/app/PageHeader";
import { DangerZoneForm } from "./DangerZoneForm";
import { SettingsNavTabs } from "../components/SettingsNavTabs";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function DangerZonePage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const userInfo = await getUserInfo();

  let members: any[] = [];
  try {
    const memRes = await httpClient.get<any[]>("/workspace-members", {
      params: { workspaceSlug },
    });
    members = memRes.data || [];
    const myMembership = members.find(
      (m: any) => m.userId === userInfo?.id || m.user?.email === userInfo?.email
    );

    // Only OWNER or SUPER_ADMIN can enter Danger Zone
    if (myMembership && myMembership.role !== "OWNER" && userInfo?.role !== "SUPER_ADMIN") {
      redirect(`/w/${workspaceSlug}/settings/general`);
    }
  } catch {
    //
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Danger Zone"
        description="Irreversible and destructive actions for this workspace."
        breadcrumbs={[
          { label: "Dashboard", href: `/w/${workspaceSlug}/dashboard` },
          { label: "Settings" },
          { label: "Danger Zone" },
        ]}
      />

      <SettingsNavTabs workspaceSlug={workspaceSlug} isOwner={true} />

      <DangerZoneForm
        workspaceSlug={workspaceSlug}
        members={members}
        currentUserId={userInfo?.id}
      />
    </div>
  );
}
