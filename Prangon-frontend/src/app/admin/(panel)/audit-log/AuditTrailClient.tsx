"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldAlert, Clock, User, Search, Shield, Filter } from "lucide-react";

interface AuditTrailClientProps {
  initialLogs: any[];
}

export function AuditTrailClient({ initialLogs }: AuditTrailClientProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  const filtered = initialLogs.filter((log) => {
    const matchesSearch =
      (log.action && log.action.toLowerCase().includes(search.toLowerCase())) ||
      (log.admin?.name && log.admin.name.toLowerCase().includes(search.toLowerCase())) ||
      (log.admin?.email && log.admin.email.toLowerCase().includes(search.toLowerCase())) ||
      (log.targetId && log.targetId.toLowerCase().includes(search.toLowerCase()));

    const matchesAction =
      actionFilter === "ALL"
        ? true
        : log.action && log.action.toLowerCase().includes(actionFilter.toLowerCase());

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            Platform Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Immutable log of administrative operations, tenant overrides, and security events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
            {initialLogs.length} Recorded Events
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg border border-border w-fit">
          {["ALL", "AUTH", "WORKSPACE", "ADMIN"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActionFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                actionFilter === tab
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "ALL" ? "All Operations" : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or staff email..."
            className="pl-8 h-9 text-xs bg-card border-border"
          />
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/30 hover:bg-muted/30 text-xs font-semibold text-muted-foreground">
                  <TableHead className="w-[220px]">Operation</TableHead>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Target ID</TableHead>
                  <TableHead>Metadata</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((log: any) => (
                  <TableRow
                    key={log.id}
                    className="border-border hover:bg-muted/40 text-xs transition-colors"
                  >
                    <TableCell>
                      <Badge className="bg-primary/15 text-primary text-[10px] font-mono border-none">
                        {log.action}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <User className="size-3 text-muted-foreground" />
                        <span>{log.admin?.name || log.admin?.email || "System"}</span>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-muted-foreground text-[11px]">
                      {log.targetId ? log.targetId.slice(0, 16) + "..." : "N/A"}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-[11px] max-w-[200px] truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : "-"}
                    </TableCell>

                    <TableCell className="text-right text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center space-y-2">
              <ShieldAlert className="size-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-semibold text-foreground">No audit events found</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {search
                  ? "No recorded events matched your search criteria."
                  : "Actions performed by platform administrators and security services will automatically record here."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
