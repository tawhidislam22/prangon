import { getPlatformStatsAction } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Building2,
  Users,
  CreditCard,
  DollarSign,
  FolderKanban,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Activity,
  ClipboardList,
} from "lucide-react";

export default async function PlatformAdminDashboard() {
  const statsRes = await getPlatformStatsAction();
  const data = statsRes.data || {
    metrics: {
      totalWorkspaces: 0,
      totalUsers: 0,
      activeSubscriptions: 0,
      estimatedMRR: 0,
      totalProjects: 0,
      totalTasks: 0,
    },
    recentWorkspaces: [],
    recentUsers: [],
  };

  const metrics = data.metrics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Platform Health: Nominal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Platform Governance Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cross-tenant telemetry, subscription metrics, and system-wide operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <ClipboardList className="size-3.5" />
            <span>Review Admin Requests</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0F1420] border-slate-800 text-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">Total Workspaces</p>
              <p className="text-2xl font-bold text-white">{metrics.totalWorkspaces}</p>
              <p className="text-[11px] text-slate-400">Active customer tenants</p>
            </div>
            <div className="size-11 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Building2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F1420] border-slate-800 text-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">Total Registered Users</p>
              <p className="text-2xl font-bold text-white">{metrics.totalUsers}</p>
              <p className="text-[11px] text-slate-400">Across all workspaces</p>
            </div>
            <div className="size-11 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F1420] border-slate-800 text-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">Paid Subscriptions</p>
              <p className="text-2xl font-bold text-white">{metrics.activeSubscriptions}</p>
              <p className="text-[11px] text-emerald-400 font-medium">Pro & Enterprise tiers</p>
            </div>
            <div className="size-11 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CreditCard className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F1420] border-slate-800 text-slate-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-400">Estimated MRR</p>
              <p className="text-2xl font-bold text-white">${metrics.estimatedMRR}</p>
              <p className="text-[11px] text-emerald-400 font-medium">Monthly recurring revenue</p>
            </div>
            <div className="size-11 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2-Column Section: Recent Workspaces & Recent Signups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (60% / 7 cols): Recent Workspaces */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="size-4 text-indigo-400" />
              Recent Workspace Tenants
            </h2>
            <Link
              href="/admin/workspaces"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View directory</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <Card className="bg-[#0F1420] border-slate-800 overflow-hidden">
            <CardContent className="p-0">
              {data.recentWorkspaces?.length > 0 ? (
                <div className="divide-y divide-slate-800/80">
                  {data.recentWorkspaces.map((ws: any) => (
                    <div
                      key={ws.id}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-white truncate">
                            {ws.name}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">
                            /w/{ws.slug}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          Owner: {ws.owner?.email || "Unknown"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold border-slate-700 ${
                            ws.onboardingStatus === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {ws.onboardingStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No customer workspaces created yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (40% / 5 cols): Recent Users */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="size-4 text-indigo-400" />
              Recent User Registrations
            </h2>
            <Link
              href="/admin/users"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <Card className="bg-[#0F1420] border-slate-800 overflow-hidden">
            <CardContent className="p-0">
              {data.recentUsers?.length > 0 ? (
                <div className="divide-y divide-slate-800/80">
                  {data.recentUsers.map((user: any) => (
                    <div
                      key={user.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[11px] shrink-0 uppercase">
                          {user.name ? user.name.charAt(0) : "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {user.name || "User"}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="text-[10px] border-slate-700 bg-slate-800 text-slate-300 shrink-0"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No users registered yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
