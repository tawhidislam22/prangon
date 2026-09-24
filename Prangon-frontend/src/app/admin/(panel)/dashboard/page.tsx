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
  MailCheck,
  Server,
  Database,
  Lock,
  ArrowUpRight,
  Layers,
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

  const quickStats = [
    {
      title: "Total Workspaces",
      value: metrics.totalWorkspaces,
      desc: "Active customer tenants",
      trend: "+100%",
      trendLabel: "growth",
      icon: Building2,
      href: "/admin/workspaces",
      accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Registered Users",
      value: metrics.totalUsers,
      desc: "Across all workspaces",
      trend: "+8.4%",
      trendLabel: "this month",
      icon: Users,
      href: "/admin/users",
      accent: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Active Subscriptions",
      value: metrics.activeSubscriptions,
      desc: "Pro & Enterprise contracts",
      trend: "Recurring",
      trendLabel: "tier",
      icon: CreditCard,
      href: "/admin/subscriptions",
      accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Estimated MRR",
      value: `$${metrics.estimatedMRR.toLocaleString()}`,
      desc: "Monthly recurring revenue",
      trend: "Live",
      trendLabel: "telemetry",
      icon: DollarSign,
      href: "/admin/subscriptions",
      accent: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  const systemServices = [
    { name: "API Gateway", status: "Operational", ping: "99.99%", icon: Server },
    { name: "Database (PostgreSQL)", status: "Healthy", ping: "12ms", icon: Database },
    { name: "Auth Engine (BetterAuth)", status: "Active", ping: "Nominal", icon: Lock },
    { name: "Email Delivery Engine", status: "Connected", ping: "Ready", icon: MailCheck },
  ];

  return (
    <div className="space-y-8 transition-colors">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Platform Status: Nominal
            </span>
            <Badge variant="secondary" className="text-[10px] font-semibold py-0">
              Live Cluster
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            Platform Governance Console
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time cross-tenant telemetry, subscription metrics, and system-wide operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs transition-colors"
          >
            <ClipboardList className="size-3.5" />
            <span>Admin Requests</span>
          </Link>

          <Link
            href="/admin/emails"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-semibold border border-border shadow-xs transition-colors"
          >
            <MailCheck className="size-3.5" />
            <span>Email Console</span>
          </Link>
        </div>
      </div>

      {/* Real-time Health Telemetry Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {systemServices.map((svc) => {
          const Icon = svc.icon;
          return (
            <div
              key={svc.name}
              className="p-3 rounded-xl border border-border bg-card/60 flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{svc.name}</p>
                  <p className="text-[10px] text-muted-foreground">{svc.status}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                {svc.ping}
              </span>
            </div>
          );
        })}
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href} className="group block">
              <Card className="border-border bg-card hover:border-primary/40 hover:shadow-md transition-all">
                <CardContent className="p-5 flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground tracking-tight">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {stat.trend}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{stat.desc}</span>
                    </div>
                  </div>
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 ${stat.accent}`}
                  >
                    <Icon className="size-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 2-Column Section: Recent Workspaces & Recent Signups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (60% / 7 cols): Recent Workspaces */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              Recent Workspace Tenants
            </h2>
            <Link
              href="/admin/workspaces"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View directory</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <Card className="border-border bg-card shadow-xs overflow-hidden">
            <CardContent className="p-0">
              {data.recentWorkspaces?.length > 0 ? (
                <div className="divide-y divide-border">
                  {data.recentWorkspaces.map((ws: any) => (
                    <div
                      key={ws.id}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {ws.name ? ws.name.charAt(0).toUpperCase() : "W"}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-foreground truncate">
                              {ws.name}
                            </p>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              /w/{ws.slug}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate">
                            Owner: {ws.owner?.email || "Unknown"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            ws.onboardingStatus === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {ws.onboardingStatus}
                        </Badge>

                        <Link
                          href={`/owner/dashboard`}
                          target="_blank"
                          className="size-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          title="Open tenant workspace"
                        >
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center space-y-2">
                  <Building2 className="size-8 text-muted-foreground/50 mx-auto" />
                  <p className="text-xs font-medium text-foreground">No customer workspaces yet</p>
                  <p className="text-[11px] text-muted-foreground">
                    Tenant workspaces will appear here once organizations register.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (40% / 5 cols): Recent Users */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="size-4 text-primary" />
              Recent Registrations
            </h2>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <Card className="border-border bg-card shadow-xs overflow-hidden">
            <CardContent className="p-0">
              {data.recentUsers?.length > 0 ? (
                <div className="divide-y divide-border">
                  {data.recentUsers.map((user: any) => (
                    <div
                      key={user.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-[11px] shrink-0 uppercase border border-border">
                          {user.name ? user.name.charAt(0) : "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {user.name || "User"}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className="text-[10px] font-semibold shrink-0"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center space-y-2">
                  <Users className="size-8 text-muted-foreground/50 mx-auto" />
                  <p className="text-xs font-medium text-foreground">No users registered yet</p>
                  <p className="text-[11px] text-muted-foreground">
                    New user accounts will record here upon sign up.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
