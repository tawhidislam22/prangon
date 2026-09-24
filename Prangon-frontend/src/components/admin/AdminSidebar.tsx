"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  ClipboardList,
  ShieldAlert,
  Shield,
  MailCheck,
  ChevronsUpDown,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/services/auth.services";
import { getAdminRequestsAction } from "@/app/admin/(panel)/requests/_action";
import { PrangonLogo } from "@/components/PrangonLogo";

interface AdminSidebarProps {
  userEmail?: string;
  userName?: string;
  userRole?: string;
  userImage?: string;
  onNavigate?: () => void;
}

interface NavGroup {
  label: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }[];
}

export function AdminSidebar({
  userEmail = "admin@prangon.internal",
  userName = "Platform Admin",
  userRole = "SUPER_ADMIN",
  userImage,
  onNavigate,
}: AdminSidebarProps = {}) {
  const pathname = usePathname();
  const [pendingRequests, setPendingRequests] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const fetchPending = async () => {
      try {
        const res = await getAdminRequestsAction();
        if (isMounted && res.success && Array.isArray(res.data)) {
          const count = res.data.filter((r) => r.status === "PENDING").length;
          setPendingRequests(count);
        }
      } catch {
        // silently fallback
      }
    };
    fetchPending();
    return () => {
      isMounted = false;
    };
  }, []);

  const initials = userName
    ? userName
        .trim()
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2)
    : "PA";

  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "Platform Directory",
      items: [
        {
          name: "Tenant Workspaces",
          href: "/admin/workspaces",
          icon: Building2,
        },
        {
          name: "User Directory",
          href: "/admin/users",
          icon: Users,
        },
        {
          name: "Subscriptions & MRR",
          href: "/admin/subscriptions",
          icon: CreditCard,
        },
      ],
    },
    {
      label: "Operations & Governance",
      items: [
        {
          name: "Admin Requests",
          href: "/admin/requests",
          icon: ClipboardList,
          badge: pendingRequests > 0 ? pendingRequests : undefined,
        },
        {
          name: "Email Console",
          href: "/admin/emails",
          icon: MailCheck,
        },
        {
          name: "Audit Trail",
          href: "/admin/audit-log",
          icon: ShieldAlert,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full text-card-foreground select-none shrink-0 transition-colors">
      {/* Platform Admin Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-xs">
            <Shield className="size-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-foreground">PRANGON</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/15 text-primary">
                ADMIN
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                Staff Console
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-2">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <Badge
                      className={cn(
                        "px-1.5 py-0 text-[10px] font-bold h-4.5 border-none",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary/15 text-primary"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom User Avatar / Profile */}
      <div className="p-3 border-t border-border bg-card/50 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left group outline-none"
            >
              <Avatar className="size-9 ring-1 ring-border group-hover:ring-primary/40 transition-all shrink-0">
                <AvatarImage src={userImage || undefined} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate leading-tight">
                  {userName}
                </p>
                <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                  {userEmail}
                </p>
              </div>

              <ChevronsUpDown className="size-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-56 bg-popover border-border text-popover-foreground shadow-xl mb-1.5"
          >
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground py-2">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground truncate">{userName}</span>
                  <Badge variant="secondary" className="text-[9px] font-bold">
                    {userRole}
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground truncate">{userEmail}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutUser()}
              className="cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center gap-2 py-2"
            >
              <LogOut className="size-3.5" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
