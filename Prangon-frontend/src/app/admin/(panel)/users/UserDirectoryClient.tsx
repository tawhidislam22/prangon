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
import { Users, Shield, Building2, Search, UserCheck, UserX } from "lucide-react";
import { UserRowAction } from "./UserRowAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserDirectoryClientProps {
  initialUsers: any[];
}

export function UserDirectoryClient({ initialUsers }: UserDirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "SUPER_ADMIN" | "OWNER" | "ADMIN" | "MEMBER">("ALL");

  const filtered = initialUsers.filter((user) => {
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "ALL" ? true : user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const superAdminCount = initialUsers.filter((u) => u.role === "SUPER_ADMIN").length;
  const activeCount = initialUsers.filter((u) => u.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
            User Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Global register of user accounts, administrative privileges, and status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
            {initialUsers.length} Accounts Registered
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Total Accounts</p>
          <p className="text-2xl font-bold text-foreground mt-1">{initialUsers.length}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Across all workspaces</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Active Users</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {activeCount}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Healthy account status</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Super Administrators</p>
          <p className="text-2xl font-bold text-primary mt-1">{superAdminCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Platform governance privileges</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg border border-border w-fit">
          {(["ALL", "OWNER", "ADMIN", "MEMBER", "SUPER_ADMIN"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setRoleFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                roleFilter === tab
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "ALL"
                ? "All Users"
                : tab === "SUPER_ADMIN"
                ? "Super Admins"
                : tab === "OWNER"
                ? "Owners"
                : tab === "ADMIN"
                ? "Admins"
                : "Members"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-8 h-9 text-xs bg-card border-border"
          />
        </div>
      </div>

      {/* Users Table Card */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/30 hover:bg-muted/30 text-xs font-semibold text-muted-foreground">
                  <TableHead className="w-[300px]">User</TableHead>
                  <TableHead>System Role</TableHead>
                  <TableHead className="text-center">Workspaces</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user: any) => {
                  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
                  return (
                    <TableRow
                      key={user.id}
                      className="border-border hover:bg-muted/40 text-xs transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                              {initial}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">
                              {user.name || "User"}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={user.role === "SUPER_ADMIN" ? "default" : "secondary"}
                          className={`text-[10px] font-semibold ${
                            user.role === "SUPER_ADMIN" ? "bg-primary text-primary-foreground" : ""
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center font-semibold text-foreground">
                        <span className="px-2 py-0.5 rounded-full bg-muted text-[11px]">
                          {user._count?.workspaceMembers || 0}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }`}
                        >
                          {user.status || "ACTIVE"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-right">
                        <UserRowAction userId={user.id} currentStatus={user.status || "ACTIVE"} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center space-y-2">
              <Users className="size-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-semibold text-foreground">No users found</p>
              <p className="text-xs text-muted-foreground">
                {search ? "No accounts matched your search criteria." : "No accounts registered."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
