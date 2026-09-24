"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PrangonLogo } from "@/components/PrangonLogo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, Check, Trash2, Clock, User, Mail, Calendar, FileText, ArrowLeft, RefreshCw } from "lucide-react";
import { getAdminRequestsAction, acceptAdminRequestAction, deleteAdminRequestAction } from "./_action";

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

  const fetchRequests = async () => {
    setLoading(true);
    setNotification(null);
    try {
      const res = await getAdminRequestsAction();
      if (res.success) {
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

  return (
    <div className="min-h-screen bg-paper text-ink p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-80 transition">
              <PrangonLogo size={32} />
            </Link>
            <div className="h-6 w-px bg-line" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-ink">Admin Account Requests</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cobalt/10 text-cobalt border border-cobalt/20">
                  {pendingCount} Pending
                </span>
              </div>
              <p className="text-graphite text-xs mt-0.5">
                Review and approve or reject requests for system administrator privileges.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading} className="gap-1.5 text-xs">
              <RefreshCw className="size-3.5" />
              Refresh
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="size-3.5" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {notification && (
          <Alert variant={notification.type === "error" ? "destructive" : "default"} className={notification.type === "success" ? "border-green-500 bg-green-500/10 text-green-900 dark:text-green-200" : ""}>
            <AlertDescription>{notification.text}</AlertDescription>
          </Alert>
        )}

        {/* List of requests */}
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="size-8 animate-spin mx-auto text-cobalt mb-3" />
            <p className="text-graphite text-sm">Loading admin requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <Card className="text-center py-16 border-line bg-white shadow-sm">
            <CardContent className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center mx-auto text-graphite">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-ink">No requests pending</h3>
              <p className="text-sm text-graphite max-w-sm mx-auto">
                There are currently no new administrator account requests to review.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((item) => (
              <Card key={item.id} className="border-line bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-base text-ink flex items-center gap-1.5">
                        <User className="size-4 text-graphite" />
                        {item.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                          item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.status === "REJECTED"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-graphite">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3.5" />
                        {item.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {new Date(item.createdAt).toLocaleDateString()} at{" "}
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {item.reason && (
                      <div className="text-xs text-graphite bg-ink/5 p-2.5 rounded-md border border-line/60 flex items-start gap-1.5 mt-1">
                        <FileText className="size-3.5 shrink-0 mt-0.5 text-cobalt" />
                        <span>{item.reason}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-line">
                    {item.status === "PENDING" && (
                      <Button
                        size="sm"
                        onClick={() => handleAccept(item.id)}
                        disabled={actionLoading === item.id}
                        className="bg-green-600 hover:bg-green-700 text-white gap-1 text-xs"
                      >
                        <Check className="size-3.5" />
                        Accept
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={actionLoading === item.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-1 text-xs"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}