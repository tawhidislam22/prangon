import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { InviteMemberDialog } from "../InviteMemberDialog";
import { InvitationRowActions } from "./InvitationRowActions";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Users, Mail, Clock } from "lucide-react";

export default async function PendingInvitationsPage({
  params,
}: {
  params?: Promise<any>;
}) {
  const workspaceSlug = (await getCurrentWorkspaceSlug()) || "";

  let invitations: any[] = [];
  try {
    const res = await httpClient.get<any[]>(`/invitations`, {
      params: { workspaceSlug },
    });
    invitations = res.data || [];
  } catch {
    //
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Invitations"
        description="Invitations sent to team members waiting to be accepted."
        breadcrumbs={[
          { label: "Dashboard", href: `/owner/dashboard` },
          { label: "Members", href: `/owner/members` },
          { label: "Invitations" },
        ]}
        badge={
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold text-[11px]">
            {invitations.length} Pending
          </Badge>
        }
        actions={<InviteMemberDialog workspaceSlug={workspaceSlug} />}
      />

      {/* Nav Tabs: Members vs Invitations */}
      <div className="flex items-center gap-4 border-b border-line pb-2">
        <Link
          href={`/owner/members`}
          className="text-xs font-medium text-graphite hover:text-ink pb-2.5 -mb-2.5 flex items-center gap-1.5 transition-colors"
        >
          <Users className="size-3.5" />
          <span>Active Members</span>
        </Link>
        <Link
          href={`/owner/members/invitations`}
          className="text-xs font-semibold text-cobalt border-b-2 border-cobalt pb-2.5 -mb-2.5 flex items-center gap-1.5"
        >
          <Mail className="size-3.5" />
          <span>Pending Invitations ({invitations.length})</span>
        </Link>
      </div>

      {/* Invitations Table */}
      <Card className="border border-line bg-white shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {invitations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40 text-xs font-semibold">
                  <TableHead className="w-[300px]">Invited Email</TableHead>
                  <TableHead>Assigned Role</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead className="text-right w-[160px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                          <Mail className="size-3.5" />
                        </div>
                        <span className="text-xs font-medium text-ink">{inv.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs border-line">
                        {inv.role || "MEMBER"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-graphite">
                      {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "Pending"}
                    </TableCell>
                    <TableCell className="text-right">
                      <InvitationRowActions
                        invitationId={inv.id}
                        workspaceSlug={workspaceSlug}
                        token={inv.token}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12">
              <EmptyState
                icon={Mail}
                title="No pending invitations"
                description="All invited team members have joined or no invitations are currently pending."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
