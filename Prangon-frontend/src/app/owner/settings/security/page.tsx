import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { PageHeader } from "@/components/app/PageHeader";
import { SettingsNavTabs } from "../components/SettingsNavTabs";
import { SecurityForm } from "./SecurityForm";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function SecuritySettingsPage({
  params,
}: {
  params?: Promise<any>;
}) {
  const workspaceSlug = (await getCurrentWorkspaceSlug()) || "";
  const userInfo = await getUserInfo();

  let isOwner = false;
  let sessions: any[] = [];

  try {
    const [memRes, sessRes] = await Promise.allSettled([
      httpClient.get<any[]>("/workspace-members", { params: { workspaceSlug } }),
      httpClient.get<any[]>("/users/sessions"),
    ]);

    if (memRes.status === "fulfilled") {
      const members = memRes.value.data || [];
      const myMembership = members.find(
        (m: any) => m.userId === userInfo?.id || m.user?.email === userInfo?.email
      );
      if (myMembership?.role === "MEMBER" && userInfo?.role !== "SUPER_ADMIN") {
        redirect(`/owner/dashboard`);
      }
      isOwner = myMembership?.role === "OWNER" || userInfo?.role === "SUPER_ADMIN";
    }

    if (sessRes.status === "fulfilled" && sessRes.value.data) {
      sessions = sessRes.value.data;
    }
  } catch {
    //
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Security & Sessions"
        description="Review active browser sessions, configure two-factor authentication, and secure your credentials."
        breadcrumbs={[
          { label: "Dashboard", href: `/owner/dashboard` },
          { label: "Settings" },
          { label: "Security & Sessions" },
        ]}
      />

      <SettingsNavTabs isOwner={isOwner} />

      <SecurityForm initialSessions={sessions} />
    </div>
  );
}
