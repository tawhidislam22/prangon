import { httpClient } from "@/lib/axios/httpClient";
import Link from "next/link";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";
import { IWorkspace } from "@/types/workspace.types";
import { Building2, Users, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MemberDashboardView } from "@/app/owner/dashboard/components/MemberDashboardView";

async function MemberDashboardWrapper({ workspaceSlug }: { workspaceSlug: string }) {
  const userInfo = await getUserInfo();
  let summary: any = null;
  try {
    const res = await httpClient.get(`/workspaces/${workspaceSlug}/dashboard-summary`);
    if (res.data) summary = res.data;
  } catch {}

  const workspaceName = summary?.workspace?.name || workspaceSlug;
  const userTasks = summary?.userTasks || [];

  return (
    <MemberDashboardView
      workspaceSlug={workspaceSlug}
      workspaceName={workspaceName}
      userName={userInfo?.name || "Member"}
      tasks={userTasks}
    />
  );
}

export default async function DashboardPage() {
  const userInfo = await getUserInfo();
  if (userInfo?.role === "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  let workspaces: IWorkspace[] = [];
  try {
    const res = await httpClient.get<IWorkspace[]>("/workspaces");
    workspaces = res.data || [];
  } catch {
    // Render the empty state when the API is temporarily unavailable.
  }

  const isMember = userInfo?.role === "MEMBER";

  // If the user has workspaces, route directly to their dashboard
  if (!isMember && workspaces.length > 0) {
    redirect(`/owner/dashboard`);
  }

  if (isMember && workspaces.length > 0) {
    // Render the Member dashboard right here!
    return <MemberDashboardWrapper workspaceSlug={workspaces[0].slug} />;
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
              Your Workspaces
            </h1>
            <Badge variant="outline" className="text-xs uppercase font-semibold">
              {userInfo?.role || "MEMBER"}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isMember
              ? "Workspaces you have been invited to collaborate in."
              : "Manage and switch between your customer company workspaces."}
          </p>
        </div>

        {!isMember && (
          <Link
            href="/workspaces/create"
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow hover:opacity-95 transition"
          >
            + New Workspace
          </Link>
        )}
      </div>

      {workspaces.length === 0 ? (
        isMember ? (
          <div className="p-10 rounded-2xl border border-border bg-card shadow-xs text-center max-w-lg mx-auto space-y-4 my-8">
            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Users className="size-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">No Workspace Assigned Yet</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hello <strong className="text-foreground">{userInfo?.name || "Member"}</strong>, your account is active as a workspace <span className="font-semibold text-foreground">Member</span>. You haven&apos;t joined a workspace yet.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-left text-xs text-muted-foreground space-y-2">
              <div className="flex items-start gap-2">
                <Mail className="size-4 text-primary shrink-0 mt-0.5" />
                <p>Check your email for an invitation link sent by your workspace administrator or owner.</p>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                <p>Once you accept the invite, you will automatically be redirected to your team dashboard.</p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/my-profile"
                className="text-xs font-semibold text-primary hover:underline underline-offset-4"
              >
                View Your Profile &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-10 rounded-2xl border border-border bg-card shadow-xs text-center max-w-md mx-auto space-y-3 my-8">
            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Building2 className="size-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground">You don&apos;t have any workspaces yet</h2>
            <p className="text-xs text-muted-foreground">
              Create your first company workspace to start adding projects and inviting collaborators.
            </p>
            <div className="pt-2">
              <Link
                href="/workspaces/create"
                className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold shadow hover:opacity-95 transition"
              >
                Create your first workspace &rarr;
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/owner/dashboard`}
              className="block group"
            >
              <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 shadow-xs hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {workspace.name ? workspace.name.charAt(0).toUpperCase() : "W"}
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {workspace.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    /{workspace.slug}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
