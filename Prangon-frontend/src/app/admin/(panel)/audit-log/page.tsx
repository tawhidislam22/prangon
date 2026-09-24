import { getAuditLogsAction } from "../actions";
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
import { ShieldAlert, Clock, User } from "lucide-react";

export default async function PlatformAuditLogPage() {
  const res = await getAuditLogsAction();
  const logs = res.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Platform Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of administrative operations, tenant overrides, and security events.
          </p>
        </div>

        <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 text-xs">
          {logs.length} Recorded Events
        </Badge>
      </div>

      <Card className="bg-[#0F1420] border-slate-800 overflow-hidden">
        <CardContent className="p-0">
          {logs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/50 text-xs font-semibold text-slate-400">
                  <TableHead className="w-[200px]">Action</TableHead>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Target ID</TableHead>
                  <TableHead>Metadata</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log: any) => (
                  <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/30 text-xs">
                    <TableCell>
                      <Badge className="bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border-none">
                        {log.action}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-white font-medium">
                      <div className="flex items-center gap-1.5">
                        <User className="size-3 text-slate-400" />
                        <span>{log.admin?.name || log.admin?.email || "System"}</span>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-slate-400 text-[11px]">
                      {log.targetId ? log.targetId.slice(0, 16) + "..." : "N/A"}
                    </TableCell>

                    <TableCell className="text-slate-400 text-[11px]">
                      {log.metadata ? JSON.stringify(log.metadata) : "-"}
                    </TableCell>

                    <TableCell className="text-right text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              No staff operations logged yet. Actions performed by platform administrators will record here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
