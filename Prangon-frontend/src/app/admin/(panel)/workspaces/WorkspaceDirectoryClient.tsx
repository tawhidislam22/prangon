"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import {
  Building2,
  ExternalLink,
  Users,
  FolderKanban,
  Search,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { WorkspaceRowAction } from "./WorkspaceRowAction";

interface WorkspaceDirectoryClientProps {
  initialWorkspaces: any[];
}

export function WorkspaceDirectoryClient({
  initialWorkspaces,
}: WorkspaceDirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "PENDING">("ALL");

  const filtered = initialWorkspaces.filter((ws) => {
    const matchesSearch =
      ws.name.toLowerCase().includes(search.toLowerCase()) ||
      ws.slug.toLowerCase().includes(search.toLowerCase()) ||
      (ws.owner?.email && ws.owner.email.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "COMPLETED"
        ? ws.onboardingStatus === "COMPLETED"
        : ws.onboardingStatus !== "COMPLETED";

    return matchesSearch && matchesStatus;
  });

  const totalMembers = initialWorkspaces.reduce(
    (acc, ws) => acc + (ws._count?.workspaceMembers || 1),
    0
  );
  const totalProjects = initialWorkspaces.reduce(
    (acc, ws) => acc + (ws._count?.projects || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            Tenant Workspaces
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Directory of customer organizations, tenant owners, and isolation boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
            {initialWorkspaces.length} Tenants Registered
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Total Tenants</p>
          <p className="text-2xl font-bold text-foreground mt-1">{initialWorkspaces.length}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Isolated customer accounts</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Combined Members</p>
          <p className="text-2xl font-bold text-primary mt-1">{totalMembers}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Users across all workspaces</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Total Projects</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {totalProjects}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Created across platform</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg border border-border w-fit">
          {(["ALL", "COMPLETED", "PENDING"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                statusFilter === tab
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "ALL" ? "All Tenants" : tab === "COMPLETED" ? "Active" : "Pending Setup"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenant or slug..."
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
                  <TableHead className="w-[280px]">Tenant Name / Slug</TableHead>
                  <TableHead>Owner Email</TableHead>
                  <TableHead className="text-center">Members</TableHead>
                  <TableHead className="text-center">Projects</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right w-[160px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ws: any) => (
                  <TableRow
                    key={ws.id}
                    className="border-border hover:bg-muted/40 text-xs transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {ws.name ? ws.name.charAt(0).toUpperCase() : "W"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{ws.name}</p>
                          <p className="text-[11px] font-mono text-muted-foreground">
                            /w/{ws.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-foreground">
                      {ws.owner?.email || "Unknown"}
                    </TableCell>

                    <TableCell className="text-center font-semibold text-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-muted text-[11px]">
                        {ws._count?.workspaceMembers || 1}
                      </span>
                    </TableCell>

                    <TableCell className="text-center font-semibold text-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-muted text-[11px]">
                        {ws._count?.projects || 0}
                      </span>
                    </TableCell>

                    <TableCell>
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
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {new Date(ws.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/owner/dashboard`}
                          target="_blank"
                          className="inline-flex items-center gap-1 h-7 px-2 text-xs rounded-md bg-muted hover:bg-accent text-foreground transition-colors"
                          title="Open tenant console"
                        >
                          <ArrowUpRight className="size-3" />
                          <span>Inspect</span>
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
            <div className="p-12 text-center space-y-2">
              <Building2 className="size-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-semibold text-foreground">No matching workspaces</p>
              <p className="text-xs text-muted-foreground">
                {search
                  ? "No tenant workspaces matched your search term."
                  : "No tenant workspaces found."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
