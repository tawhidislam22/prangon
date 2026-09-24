import { getAllSubscriptionsAction } from "../actions";
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
import { CreditCard, Building2, CheckCircle2, Clock } from "lucide-react";

export default async function PlatformSubscriptionsPage() {
  const res = await getAllSubscriptionsAction();
  const subscriptions = res.data || [];

  const activeCount = subscriptions.filter((s: any) => s.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Subscriptions & Revenue Monitor
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of customer billing tiers, recurring contracts, and renewals.
          </p>
        </div>

        <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 text-xs">
          {activeCount} Active Subscriptions
        </Badge>
      </div>

      <Card className="bg-[#0F1420] border-slate-800 overflow-hidden">
        <CardContent className="p-0">
          {subscriptions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/50 text-xs font-semibold text-slate-400">
                  <TableHead className="w-[300px]">Workspace Tenant</TableHead>
                  <TableHead>Subscription Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Renewal / Period End</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub: any) => (
                  <TableRow key={sub.id} className="border-slate-800 hover:bg-slate-800/30 text-xs">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                          <CreditCard className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">
                            {sub.workspace?.name || "Workspace"}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">
                            /w/{sub.workspace?.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase border-none">
                        {sub.tier || "PREMIUM"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold border-slate-700 ${
                          sub.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {sub.status || "ACTIVE"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-slate-300">
                      {sub.currentPeriodEnd
                        ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                        : "Ongoing"}
                    </TableCell>

                    <TableCell className="text-slate-400">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              No subscriptions active yet. Free tier tenants do not generate recurring billing records.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
