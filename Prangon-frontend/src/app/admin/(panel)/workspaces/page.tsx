import { getAllWorkspacesAction } from "../actions";
import { WorkspaceRowAction } from "./WorkspaceRowAction";
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
import { Building2, ExternalLink, Users, FolderKanban } from "lucide-react";
import Link from "next/link";

export default async function PlatformWorkspacesPage() {
  const res = await getAllWorkspacesAction();
  const workspaces = res.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Tenant Workspaces
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Directory of all customer organizations, tenant owners, and isolation boundaries.
          </p>
        </div>

        <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 text-xs">
          {workspaces.length} Tenants Registered
        </Badge>
      </div>

      <Card className="bg-[#0F1420] border-slate-800 overflow-hidden">
        <CardContent className="p-0">
          {workspaces.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/50 text-xs font-semibold text-slate-400">
                  <TableHead className="w-[280px]">Tenant Name / Slug</TableHead>
                  <TableHead>Owner Email</TableHead>
                  <TableHead className="text-center">Members</TableHead>
                  <TableHead className="text-center">Projects</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces.map((ws: any) => (
                  <TableRow key={ws.id} className="border-slate-800 hover:bg-slate-800/30 text-xs">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                          <Building2 className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{ws.name}</p>
                          <p className="text-[11px] font-mono text-slate-400">/w/{ws.slug}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-300">
                      {ws.owner?.email || "Unknown"}
                    </TableCell>

                    <TableCell className="text-center font-semibold text-slate-300">
                      {ws._count?.workspaceMembers || 1}
                    </TableCell>

                    <TableCell className="text-center font-semibold text-slate-300">
                      {ws._count?.projects || 0}
                    </TableCell>

                    <TableCell>
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
                    </TableCell>

                    <TableCell className="text-slate-400">
                      {new Date(ws.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/w/${ws.slug}/dashboard`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded hover:bg-slate-800"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="size-3" />
                        </Link>
                        <WorkspaceRowAction
                          workspaceId={ws.id}
                          currentStatus={ws.onboardingStatus}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              No workspaces found in the database.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
