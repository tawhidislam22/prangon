import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
import Link from "next/link";
import { httpClient } from "@/lib/axios/httpClient";
import { getUserInfo } from "@/services/auth.services";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderKanban,
  ListTodo,
  Users,
  CalendarClock,
  UserPlus,
  Activity,
  Settings,
  Plus,
} from "lucide-react";
import { TaskStatusChart } from "./components/TaskStatusChart";
import { ActivityFeedList } from "./components/ActivityFeedList";
import { TaskList } from "./components/TaskList";
import { MemberDashboardView } from "./components/MemberDashboardView";
interface DashboardSummaryData {
  workspace: {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    logoUrl?: string | null;
  };
  stats: {
    activeProjects: number;
    openTasks: number;
    teamMembers: number;
    tasksDueThisWeek: number;
  };
  taskStatusCounts: {
    todo: number;
    inProgress: number;
    done: number;
    total: number;
  };
  recentActivities: any[];
  userTasks: any[];
}

export default async function WorkspaceDashboardPage({
  params,
}: {
  params?: Promise<any>;
}) {
  const workspaceSlug = (await getCurrentWorkspaceSlug()) || "";
  const userInfo = await getUserInfo();

  let summary: DashboardSummaryData | null = null;
  try {
    const res = await httpClient.get<DashboardSummaryData>(
      `/workspaces/${workspaceSlug}/dashboard-summary`
    );
    if (res.data) summary = res.data;
  } catch (error: any) {
    console.warn("Failed to load dashboard summary:", error?.message || error);
  }

  // ── Determine workspace role ─────────────────────────
  let workspaceRole: "OWNER" | "ADMIN" | "MEMBER" = "MEMBER";
  if (
    userInfo?.role === "SUPER_ADMIN" ||
    summary?.workspace?.ownerId === userInfo?.id
  ) {
    workspaceRole = "OWNER";
  } else {
    try {
      const memRes = await httpClient.get<any[]>("/workspace-members", {
        params: { workspaceSlug },
      });
      const members = memRes.data || [];
      const myMembership = members.find(
        (m: any) =>
          m.userId === userInfo?.id || m.user?.email === userInfo?.email
      );
      if (myMembership?.role === "OWNER") workspaceRole = "OWNER";
      else if (myMembership?.role === "ADMIN") workspaceRole = "ADMIN";
    } catch {
      // keep as MEMBER
    }
  }

  // ── Common data ──────────────────────────────────────
  const workspaceName =
    summary?.workspace?.name ||
    workspaceSlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  const stats = summary?.stats || {
    activeProjects: 0,
    openTasks: 0,
    teamMembers: 1,
    tasksDueThisWeek: 0,
  };
  const taskStatusCounts = summary?.taskStatusCounts || {
    todo: 0,
    inProgress: 0,
    done: 0,
    total: 0,
  };
  const recentActivities = summary?.recentActivities || [];
  const userTasks = summary?.userTasks || [];

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MEMBER VIEW — task-focused personal hub
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (workspaceRole === "MEMBER") {
    return (
      <MemberDashboardView
        workspaceSlug={workspaceSlug}
        workspaceName={workspaceName}
        userName={userInfo?.name || "Member"}
        tasks={userTasks}
      />
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // OWNER / ADMIN VIEW — workspace management dashboard
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const isOwner = workspaceRole === "OWNER";

  const quickActions = [
    {
      label: "New Project",
      description: "Create & organize a project",
      href: `/owner/projects`,
      icon: Plus,
      color: "text-primary",
      bg: "bg-primary/10",
      visible: true,
    },
    {
      label: "Invite Members",
      description: "Grow your team",
      href: `/owner/members/invitations`,
      icon: UserPlus,
      color: "text-primary",
      bg: "bg-primary/10",
      visible: isOwner,
    },
    {
      label: "Activity Log",
      description: "Review team actions",
      href: `/owner/activity`,
      icon: Activity,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      visible: true,
    },
    {
      label: "Workspace Settings",
      description: "Configure your workspace",
      href: `/owner/settings/general`,
      icon: Settings,
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-500/10",
      visible: isOwner,
    },
  ];

  const visibleActions = quickActions.filter((a) => a.visible);

  return (
    <div className="space-y-8">
      {/* ── Page header ──────────────────────────────── */}
      <PageHeader
        title="Dashboard"
        description={`Workspace management overview for ${workspaceName}. Monitor projects, team activity, and task progress.`}
        badge={
          <Badge
            variant="indigo"
            className="font-semibold text-[11px] px-2.5 py-0.5"
          >
            {workspaceName} • {workspaceRole}
          </Badge>
        }
      />

      {/* ── Quick actions ────────────────────────────── */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          visibleActions.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
        } gap-3`}
      >
        {visibleActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href} className="group">
              <Card className="border-border hover:border-primary/40 transition-all hover:shadow-xs h-full">
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className={`size-9 rounded-lg ${action.bg} ${action.color} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {action.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* ── Stat cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          description="Projects across workspace"
          icon={FolderKanban}
        />
        <StatCard
          title="Open Tasks"
          value={stats.openTasks}
          description={`${taskStatusCounts.done} completed so far`}
          icon={ListTodo}
        />
        <StatCard
          title="Team Members"
          value={stats.teamMembers}
          description="Collaborators in workspace"
          icon={Users}
        />
        <StatCard
          title="Tasks Due This Week"
          value={stats.tasksDueThisWeek}
          description="Upcoming deadline milestones"
          icon={CalendarClock}
        />
      </div>

      {/* ── Activity feed + Task status chart ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <ActivityFeedList
            activities={recentActivities}
          />
        </div>
        <div className="lg:col-span-5">
          <TaskStatusChart statusCounts={taskStatusCounts} />
        </div>
      </div>

      {/* ── Your assigned tasks ──────────────────────── */}
      <div>
        <TaskList tasks={userTasks} />
      </div>
    </div>
  );
}