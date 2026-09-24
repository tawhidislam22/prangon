"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ShieldCheck, UserCheck, ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAdminRequestsAction } from "@/app/admin/(panel)/requests/_action";

interface AdminRequest {
  id: string;
  name: string;
  email: string;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export function AdminNotificationDropdown() {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadRequests = async () => {
      setLoading(true);
      try {
        const res = await getAdminRequestsAction();
        if (isMounted && res.success && Array.isArray(res.data)) {
          setRequests(res.data.filter((r) => r.status === "PENDING"));
        }
      } catch {
        // Fallback silently if requests are unavailable
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  const unreadCount = requests.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative size-9 bg-card border-border hover:bg-accent text-foreground rounded-lg"
        >
          <Bell className="size-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 size-4 bg-primary text-primary-foreground rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-popover border-border text-popover-foreground shadow-xl"
      >
        <DropdownMenuLabel className="flex items-center justify-between py-2.5 px-3">
          <span className="text-xs font-semibold text-foreground">Admin Notifications</span>
          {unreadCount > 0 ? (
            <Badge className="bg-primary/15 text-primary border-none text-[10px]">
              {unreadCount} pending
            </Badge>
          ) : (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-none text-[10px]">
              Operational
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
          {requests.length > 0 ? (
            requests.slice(0, 4).map((req) => (
              <DropdownMenuItem
                key={req.id}
                asChild
                className="p-3 cursor-pointer focus:bg-accent focus:text-accent-foreground"
              >
                <Link href="/admin/requests" className="flex items-start gap-2.5 w-full">
                  <div className="size-7 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <UserCheck className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      Admin request: {req.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{req.email}</p>
                    <p className="text-[10px] text-primary font-medium mt-0.5">Awaiting review</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center">
              <CheckCircle className="size-6 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-medium text-foreground">No pending admin alerts</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Platform telemetry nominal</p>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="p-1">
          <DropdownMenuItem
            asChild
            className="cursor-pointer text-xs justify-center font-medium text-primary focus:text-primary focus:bg-primary/10 py-2"
          >
            <Link href="/admin/requests" className="flex items-center gap-1.5">
              <span>View All Admin Requests</span>
              <ExternalLink className="size-3" />
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
