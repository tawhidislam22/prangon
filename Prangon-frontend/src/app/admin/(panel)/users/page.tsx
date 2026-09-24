import { getAllUsersAction } from "../actions";
import { UserRowAction } from "./UserRowAction";
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
import { Users, Shield, Building2 } from "lucide-react";

export default async function PlatformUsersPage() {
  const res = await getAllUsersAction();
  const users = res.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            User Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global register of user accounts across all tenant organizations.
          </p>
        </div>

        <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 text-xs">
          {users.length} Accounts Registered
        </Badge>
      </div>

      <Card className="bg-[#0F1420] border-slate-800 overflow-hidden">
        <CardContent className="p-0">
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/50 text-xs font-semibold text-slate-400">
                  <TableHead className="w-[300px]">User</TableHead>
                  <TableHead>System Role</TableHead>
                  <TableHead className="text-center">Workspaces</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/30 text-xs">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {user.name ? user.name.charAt(0) : "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">
                            {user.name || "User"}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold border-slate-700 ${
                          user.role === "SUPER_ADMIN"
                            ? "bg-indigo-500/20 text-indigo-300"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center font-semibold text-slate-300">
                      {user._count?.workspaceMembers || 0}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold border-slate-700 ${
                          user.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {user.status || "ACTIVE"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <UserRowAction userId={user.id} currentStatus={user.status || "ACTIVE"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              No users registered yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
