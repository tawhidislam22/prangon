import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { httpClient } from "@/lib/axios/httpClient";
import { IWorkspace } from "@/types/workspace.types";
import { getUserInfo } from "@/services/auth.services";
import { AppShell } from "@/components/app/AppShell";
import { AppWorkspaceRole } from "@/components/app/RoleGate";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params?: Promise<any>;
}) {
  const workspaceSlug = (await getCurrentWorkspaceSlug()) || "";
  const userInfo = await getUserInfo();

  let workspace: IWorkspace | undefined;
  let allWorkspaces: IWorkspace[] = [];
  try {
    const workspacesResponse = await httpClient.get<IWorkspace[]>("/workspaces");
    allWorkspaces = workspacesResponse.data || [];
    workspace = allWorkspaces.find((item) => item.slug === workspaceSlug);
  } catch {
    // If it fails, let it fall through to fallback
  }

  if (!workspace) {
    if (workspaceSlug === "my-workspace") {
      workspace = allWorkspaces[0] || {
        id: "my-workspace",
        name: "My Workspace",
        slug: "my-workspace",
        userId: "owner",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        onboardingStatus: "COMPLETED",
      };
    } else if (allWorkspaces.length > 0) {
      redirect(`/owner/dashboard`);
    } else {
      workspace = {
        id: workspaceSlug,
        name: workspaceSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        slug: workspaceSlug,
        userId: "owner",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        onboardingStatus: "COMPLETED",
      };
    }
  }

  // Only the OWNER of the workspace should ever be redirected to company onboarding.
  // Members and Admins must NEVER be trapped in company onboarding flows.
  const isOwner = userInfo?.role === "OWNER" || (workspace as any)?.ownerId === userInfo?.id || (workspace as any)?.userId === userInfo?.id;
  if (isOwner && workspace.onboardingStatus && workspace.onboardingStatus !== "COMPLETED") {
    if (workspace.onboardingStatus === "PENDING_COMPANY") {
      redirect(`/onboarding/company`);
    } else if (workspace.onboardingStatus === "PENDING_PLAN") {
      redirect(`/onboarding/plan`);
    } else if (workspace.onboardingStatus === "PENDING_PAYMENT") {
      redirect(`/onboarding/payment`);
    } else {
      redirect(`/onboarding/workspace?workspace=${workspace.slug}`);
    }
  }

  // Resolve currentRole accurately:
  // If user is platform super admin or workspace owner -> OWNER
  // Otherwise check workspaceMember membership table
  // Fallback to user's assigned role (MEMBER / ADMIN)
  let currentRole: AppWorkspaceRole = userInfo?.role === "ADMIN" ? "ADMIN" : userInfo?.role === "MEMBER" ? "MEMBER" : "OWNER";
  if (userInfo?.role === "SUPER_ADMIN" || (workspace as any)?.ownerId === userInfo?.id || (workspace as any)?.userId === userInfo?.id) {
    currentRole = "OWNER";
  } else {
    try {
      const memRes = await httpClient.get<any[]>("/workspace-members", {
        params: { workspaceSlug: workspace.slug },
      });
      const members = memRes.data || [];
      const myMembership = members.find(
        (m: any) => m.userId === userInfo?.id || m.user?.email === userInfo?.email
      );
      if (myMembership) {
        currentRole = myMembership.role as AppWorkspaceRole;
      }
    } catch {
      // keep currentRole default
    }
  }

  return (
    <AppShell
      workspaceSlug={workspaceSlug}
      workspaceName={workspace.name}
      role={currentRole}
      userName={userInfo?.name || "User"}
      userEmail={userInfo?.email || "user@example.com"}
      workspaces={allWorkspaces}
    >
      {children}
    </AppShell>
  );
}
