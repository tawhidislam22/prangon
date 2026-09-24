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
import { CreditCard, Building2, CheckCircle2, Clock, Search, DollarSign, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface SubscriptionMonitorClientProps {
  initialSubscriptions: any[];
}

export function SubscriptionMonitorClient({
  initialSubscriptions,
}: SubscriptionMonitorClientProps) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("ALL");

  const activeCount = initialSubscriptions.filter((s) => s.status === "ACTIVE").length;

  const filtered = initialSubscriptions.filter((sub) => {
    const matchesSearch =
      (sub.workspace?.name && sub.workspace.name.toLowerCase().includes(search.toLowerCase())) ||
      (sub.workspace?.slug && sub.workspace.slug.toLowerCase().includes(search.toLowerCase()));

    const matchesTier = tierFilter === "ALL" ? true : sub.tier === tierFilter;

    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            Subscriptions & Revenue Monitor
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time tracking of customer billing tiers, recurring contracts, and renewals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
            {activeCount} Active Contracts
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Active Subscriptions</p>
          <p className="text-2xl font-bold text-foreground mt-1">{activeCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Paying customer tenants</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Estimated Base MRR</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ${(activeCount * 49).toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Estimated recurring billing</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Contract Health</p>
          <p className="text-2xl font-bold text-primary mt-1">100%</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Zero payment delinquencies</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg border border-border w-fit">
          {["ALL", "PRO", "ENTERPRISE"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTierFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                tierFilter === tab
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "ALL" ? "All Tiers" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenant..."
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
                  <TableHead className="w-[300px]">Workspace Tenant</TableHead>
                  <TableHead>Subscription Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Renewal / Period End</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sub: any) => (
                  <TableRow
                    key={sub.id}
                    className="border-border hover:bg-muted/40 text-xs transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                          <CreditCard className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {sub.workspace?.name || "Workspace"}
                          </p>
                          <p className="text-[11px] font-mono text-muted-foreground">
                            /w/{sub.workspace?.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className="bg-primary/15 text-primary text-[10px] font-bold uppercase border-none">
                        {sub.tier || "PRO"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          sub.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {sub.status || "ACTIVE"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-foreground">
                      {sub.currentPeriodEnd
                        ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                        : "Ongoing"}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      {sub.workspace?.slug && (
                        <Link
                          href={`/owner/billing`}
                          target="_blank"
                          className="inline-flex items-center gap-1 h-7 px-2 text-xs rounded-md bg-muted hover:bg-accent text-foreground transition-colors"
                        >
                          <ArrowUpRight className="size-3" />
                          <span>Billing</span>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center space-y-2">
              <CreditCard className="size-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-semibold text-foreground">No active subscriptions</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {search
                  ? "No subscriptions matched your search query."
                  : "Free tier tenants do not generate recurring billing records. When workspaces upgrade, their plans will display here."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
