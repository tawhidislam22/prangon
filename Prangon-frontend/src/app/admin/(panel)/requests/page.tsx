"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShieldCheck,
  Check,
  Trash2,
  Clock,
  User,
  Mail,
  Calendar,
  FileText,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  getAdminRequestsAction,
  acceptAdminRequestAction,
  deleteAdminRequestAction,
} from "./_action";

interface AdminRequestItem {
  id: string;
  name: string;
  email: string;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AdminRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const fetchRequests = async () => {
    setLoading(true);
    setNotification(null);
    try {
      const res = await getAdminRequestsAction();
      if (res.success && Array.isArray(res.data)) {
        setRequests(res.data);
      } else {
        setNotification({ type: "error", text: res.message || "Failed to load requests." });
      }
    } catch {
      setNotification({ type: "error", text: "Error fetching admin requests." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id: string) => {
    setActionLoading(id);
    setNotification(null);
    try {
      const res = await acceptAdminRequestAction(id);
      if (res.success) {
        setNotification({ type: "success", text: res.message });
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
        );
      } else {
        setNotification({ type: "error", text: res.message });
      }
    } catch {
      setNotification({ type: "error", text: "Failed to accept request." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin request?")) return;
    setActionLoading(id);
    setNotification(null);
    try {
      const res = await deleteAdminRequestAction(id);
      if (res.success) {
        setNotification({ type: "success", text: res.message });
        setRequests((prev) => prev.filter((r) => r.id !== id));
      } else {
        setNotification({ type: "error", text: res.message });
      }
    } catch {
      setNotification({ type: "error", text: "Failed to delete request." });
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.reason && req.reason.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
              Admin Privilege Requests
            </h1>
            {pendingCount > 0 && (
              <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs">
                {pendingCount} Pending
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Review and grant or revoke platform administrator privileges for staff members.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRequests}
            disabled={loading}
            className="gap-1.5 text-xs bg-card hover:bg-accent"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {notification && (
        <Alert
          variant={notification.type === "error" ? "destructive" : "default"}
          className={
            notification.type === "success"
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
              : ""
          }
        >
          <AlertDescription>{notification.text}</AlertDescription>
        </Alert>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg border border-border w-fit">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((tab) => {
            const count =
              tab === "ALL"
                ? requests.length
                : tab === "PENDING"
                ? pendingCount
                : tab === "APPROVED"
                ? approvedCount
                : requests.filter((r) => r.status === "REJECTED").length;

            return (
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
                {tab.charAt(0) + tab.slice(1).toLowerCase()} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-8 h-9 text-xs bg-card border-border"
          />
        </div>
      </div>

      {/* Request List */}
      {loading ? (
        <div className="text-center py-20">
          <RefreshCw className="size-8 animate-spin mx-auto text-primary mb-3" />
          <p className="text-muted-foreground text-xs">Loading admin requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="text-center py-16 border-border bg-card shadow-xs">
          <CardContent className="space-y-3">
            <ShieldCheck className="size-10 text-muted-foreground/40 mx-auto" />
            <h3 className="text-sm font-semibold text-foreground">No requests found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery || statusFilter !== "ALL"
                ? "No requests match your current search or filter criteria."
                : "No admin account requests currently awaiting review."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((req) => (
            <Card
              key={req.id}
              className={`border-border bg-card transition-all hover:shadow-xs ${
                req.status === "PENDING" ? "border-l-4 border-l-amber-500" : ""
              }`}
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {req.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm text-foreground">{req.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${
                        req.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : req.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      }`}
                    >
                      {req.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="size-3.5 text-muted-foreground" />
                      {req.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {new Date(req.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {req.reason && (
                    <div className="p-3 bg-muted/40 rounded-lg border border-border/60 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground mr-1.5">Reason:</span>
                      {req.reason}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  {req.status === "PENDING" ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(req.id)}
                        disabled={actionLoading === req.id}
                        className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                      >
                        <Check className="size-3.5" />
                        {actionLoading === req.id ? "Accepting..." : "Approve & Grant"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(req.id)}
                        disabled={actionLoading === req.id}
                        className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 border-border"
                      >
                        <Trash2 className="size-3.5" />
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(req.id)}
                      disabled={actionLoading === req.id}
                      className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}