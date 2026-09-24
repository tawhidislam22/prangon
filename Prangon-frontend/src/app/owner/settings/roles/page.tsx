import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { SettingsNavTabs } from "../components/SettingsNavTabs";
import { getUserInfo } from "@/services/auth.services";
import { httpClient } from "@/lib/axios/httpClient";
import { redirect } from "next/navigation";

export default async function RolesPermissionsPage({
  params,
}: {
  params?: Promise<any>;
}) {
  const workspaceSlug = (await getCurrentWorkspaceSlug()) || "";
  const userInfo = await getUserInfo();

  let isOwner = false;
  try {
    const memRes = await httpClient.get<any[]>("/workspace-members", {
      params: { workspaceSlug },
    });
    const members = memRes.data || [];
    const myMembership = members.find(
      (m: any) => m.userId === userInfo?.id || m.user?.email === userInfo?.email
    );
    if (myMembership && myMembership.role !== "OWNER" && userInfo?.role !== "SUPER_ADMIN") {
      redirect(`/owner/settings/security`);
    }
    isOwner = myMembership?.role === "OWNER" || userInfo?.role === "SUPER_ADMIN";
  } catch {
    //
  }

  const permissions = [
    {
      feature: "View Projects & Tasks",
      owner: true,
      admin: true,
      member: true,
    },
    {
      feature: "Create / Edit Tasks & Comments",
      owner: true,
      admin: true,
      member: true,
    },
    {
      feature: "Create & Archive Projects",
      owner: true,
      admin: true,
      member: false,
    },
    {
      feature: "Invite New Members",
      owner: true,
      admin: true,
      member: false,
    },
    {
      feature: "Change Member Roles (Promote/Demote)",
      owner: true,
      admin: false,
      member: false,
    },
    {
      feature: "Remove Members from Workspace",
      owner: true,
      admin: true,
      member: false,
    },
    {
      feature: "Manage Subscription & Billing Invoices",
      owner: true,
      admin: false,
      member: false,
    },
    {
      feature: "Update Workspace Name & Slug",
      owner: true,
      admin: false,
      member: false,
    },
    {
      feature: "Transfer Workspace Ownership",
      owner: true,
      admin: false,
      member: false,
    },
    {
      feature: "Delete Entire Workspace",
      owner: true,
      admin: false,
      member: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Roles & Permissions"
        description="Review workspace capabilities granted to Owners, Admins, and Members."
        breadcrumbs={[
          { label: "Dashboard", href: `/owner/dashboard` },
          { label: "Settings" },
          { label: "Roles & Permissions" },
        ]}
      />

      {/* Settings Navigation Tabs */}
      <SettingsNavTabs isOwner={isOwner} />

      <Card className="border border-line bg-white shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 text-xs font-semibold">
                <TableHead className="w-[320px]">Capability / Action</TableHead>
                <TableHead className="text-center">
                  <Badge className="bg-cobalt/15 text-cobalt border border-cobalt/30 text-xs font-semibold">
                    Owner
                  </Badge>
                </TableHead>
                <TableHead className="text-center">
                  <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
                    Admin
                  </Badge>
                </TableHead>
                <TableHead className="text-center">
                  <Badge variant="outline" className="text-slate-600 border-line text-xs">
                    Member
                  </Badge>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((p, idx) => (
                <TableRow key={idx} className="hover:bg-muted/20 text-xs">
                  <TableCell className="font-medium text-ink">
                    {p.feature}
                  </TableCell>
                  <TableCell className="text-center">
                    {p.owner ? (
                      <Check className="size-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="size-4 text-slate-300 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {p.admin ? (
                      <Check className="size-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="size-4 text-slate-300 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {p.member ? (
                      <Check className="size-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="size-4 text-slate-300 mx-auto" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
