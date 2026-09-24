import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createPortalSessionAction } from "./actions";
import {
  CreditCard,
  Check,
  Zap,
  Users,
  FolderKanban,
  HardDrive,
  FileText,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function BillingPage({
  params,
}: {
  params?: Promise<any>;
}) {
  const workspaceSlug = (await getCurrentWorkspaceSlug()) || "";
  const userInfo = await getUserInfo();

  let subscription: any = null;
  let memberCount = 1;
  let projectCount = 0;


  try {
    const [subRes, membersRes, summaryRes] = await Promise.allSettled([
      httpClient.get<any>(`/workspaces/${workspaceSlug}/subscription`),
      httpClient.get<any[]>("/workspace-members", { params: { workspaceSlug } }),
      httpClient.get<any>(`/workspaces/${workspaceSlug}/dashboard-summary`),
    ]);

    if (subRes.status === "fulfilled") {
      subscription = subRes.value.data;
    }
    if (membersRes.status === "fulfilled") {
      const members = membersRes.value.data || [];
      memberCount = members.length || 1;
      const myMembership = members.find(
        (m: any) => m.userId === userInfo?.id || m.user?.email === userInfo?.email
      );
      if (myMembership && myMembership.role !== "OWNER" && userInfo?.role !== "SUPER_ADMIN") {
        redirect(`/owner/dashboard`);
      }
    }
    if (summaryRes.status === "fulfilled") {
      projectCount = summaryRes.value.data?.stats?.activeProjects || 0;
    }
  } catch {
    //
  }


  const isSubscribed = subscription && subscription.status === "active";
  const planTier = isSubscribed ? "Premium" : "Free Plan";
  const memberLimit = isSubscribed ? "Unlimited" : 5;
  const projectLimit = isSubscribed ? "Unlimited" : 3;
  const storageLimit = isSubscribed ? "50 GB" : "500 MB";

  const handlePortalSession = async () => {
    "use server";
    await createPortalSessionAction();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Billing & Subscription"
        description="Manage your workspace plan, resource usage, and payment methods."
        breadcrumbs={[
          { label: "Dashboard", href: `/owner/dashboard` },
          { label: "Billing" },
        ]}
        badge={
          <Badge
            variant="outline"
            className={
              isSubscribed
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-[11px]"
                : "bg-slate-100 text-slate-700 border-line font-semibold text-[11px]"
            }
          >
            {planTier}
          </Badge>
        }
        actions={
          <Link href={`/owner/billing/invoices`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-line">
              <FileText className="size-3.5" />
              <span>View Invoices</span>
            </Button>
          </Link>
        }
      />

      {/* Plan Card */}
      <Card className="border border-line bg-white shadow-xs overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-cobalt/5 via-white to-white border-b border-line">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-ink">{planTier}</h2>
              <Badge className={isSubscribed ? "bg-cobalt text-white text-xs" : "bg-muted text-graphite text-xs"}>
                {isSubscribed ? "Active" : "Current Plan"}
              </Badge>
            </div>
            <p className="text-xs text-graphite max-w-md">
              {isSubscribed
                ? "Your workspace is unlocked with full collaboration, unlimited projects, and priority support."
                : "You are currently on the free tier. Upgrade to unlock unlimited members, projects, and advanced integrations."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <form action={handlePortalSession}>
                <Button type="submit" variant="outline" className="gap-2 text-xs border-line">
                  <CreditCard className="size-3.5 text-cobalt" />
                  <span>Stripe Billing Portal</span>
                  <ExternalLink className="size-3 text-muted-foreground" />
                </Button>
              </form>
            ) : (
              <Link href={`/owner/billing/upgrade`}>
                <Button className="bg-cobalt hover:bg-cobalt/90 text-white gap-2 text-xs shadow-xs">
                  <Zap className="size-3.5 fill-current" />
                  <span>Upgrade to Premium</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Resource Usage Meters */}
        <CardContent className="p-6 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Resource Limits & Usage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Members Meter */}
            <div className="p-4 rounded-lg border border-line bg-muted/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <Users className="size-3.5 text-cobalt" />
                  Team Members
                </span>
                <span className="text-graphite font-medium">
                  {memberCount} / {memberLimit}
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-cobalt rounded-full"
                  style={{
                    width: typeof memberLimit === "number" ? `${Math.min(100, (memberCount / memberLimit) * 100)}%` : "20%",
                  }}
                />
              </div>
            </div>

            {/* Projects Meter */}
            <div className="p-4 rounded-lg border border-line bg-muted/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <FolderKanban className="size-3.5 text-cobalt" />
                  Active Projects
                </span>
                <span className="text-graphite font-medium">
                  {projectCount} / {projectLimit}
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-cobalt rounded-full"
                  style={{
                    width: typeof projectLimit === "number" ? `${Math.min(100, (projectCount / projectLimit) * 100)}%` : "25%",
                  }}
                />
              </div>
            </div>

            {/* Storage Meter */}
            <div className="p-4 rounded-lg border border-line bg-muted/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <HardDrive className="size-3.5 text-cobalt" />
                  File Storage
                </span>
                <span className="text-graphite font-medium">
                  12 MB / {storageLimit}
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-cobalt rounded-full" style={{ width: "8%" }} />
              </div>
            </div>
          </div>
        </CardContent>

        {/* Feature Highlights Footer */}
        <CardFooter className="p-6 bg-muted/20 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-graphite">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1">
              <Check className="size-3.5 text-emerald-600" />
              Automated Backups
            </span>
            <span className="flex items-center gap-1">
              <Check className="size-3.5 text-emerald-600" />
              Role-Based Access
            </span>
            <span className="flex items-center gap-1">
              <Check className="size-3.5 text-emerald-600" />
              Kanban Task Boards
            </span>
          </div>

          <Link
            href={`/owner/billing/upgrade`}
            className="text-cobalt font-semibold hover:underline flex items-center gap-1"
          >
            Compare all plan features
            <ArrowRight className="size-3" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
