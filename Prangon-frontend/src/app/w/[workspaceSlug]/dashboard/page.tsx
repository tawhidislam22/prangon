import { httpClient } from "@/lib/axios/httpClient";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  ListTodo,
  Users,
  CalendarClock,
} from "lucide-react";
import { TaskStatusChart } from "./components/TaskStatusChart";
import { ActivityFeedList } from "./components/ActivityFeedList";
import { TaskList } from "./components/TaskList";

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
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  let summary: DashboardSummaryData | null = null;

  try {
    const res = await httpClient.get<DashboardSummaryData>(
      `/workspaces/${workspaceSlug}/dashboard-summary`
    );
    if (res.data) {
      summary = res.data;
    }
  } catch (error: any) {
    console.warn("Failed to load dashboard summary aggregate:", error?.message || error);
  }

  // Fallback defaults if aggregate endpoint has network or cold-start fallback
  const workspaceName =
    summary?.workspace?.name ||
    workspaceSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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

  return (
    <div className="space-y-8">
      {/* Page Header: "Dashboard" (no action button — summary view) */}
      <PageHeader
        title="Dashboard"
        description={`At-a-glance workspace health, team activity, and project progress for ${workspaceName}.`}
        badge={
          <Badge
            variant="outline"
            className="bg-cobalt/10 text-cobalt border-cobalt/20 font-semibold text-[11px]"
          >
            {workspaceName}
          </Badge>
        }
      />

      {/* Stat row (4× StatCard): Active projects · Open tasks · Team members · Tasks due this week */}
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

      {/* 2-column below: Left (60%) Activity feed, Right (40%) Task status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (60% / 7 cols) */}
        <div className="lg:col-span-7">
          <ActivityFeedList
            workspaceSlug={workspaceSlug}
            activities={recentActivities}
          />
        </div>

        {/* Right Column (40% / 5 cols) */}
        <div className="lg:col-span-5">
          <TaskStatusChart statusCounts={taskStatusCounts} />
        </div>
      </div>

      {/* "Your tasks" section: tasks assigned to current user, regardless of role */}
      <div>
        <TaskList workspaceSlug={workspaceSlug} tasks={userTasks} />
      </div>
    </div>
  );
}