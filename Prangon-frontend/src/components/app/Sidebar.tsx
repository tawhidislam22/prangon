"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CreditCard,
  Puzzle,
  Bell,
  Activity,
  Settings,
  Shield,
  AlertTriangle,
  FileText,
  UserPlus,
} from "lucide-react";
import { AppWorkspaceRole } from "./RoleGate";

interface NavSubItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  children?: NavSubItem[];
}

interface NavGroup {
  label: string;
  visible?: boolean;
  items: NavItem[];
}

interface SidebarProps {
  workspaceSlug: string;
  role: AppWorkspaceRole;
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({
  workspaceSlug,
  role,
  className,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  const isOwner = role === "OWNER";
  const isAdmin = role === "ADMIN";

  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        {
          name: "Dashboard",
          href: `/owner/dashboard`,
          icon: LayoutDashboard,
          visible: true,
        },
        {
          name: "Projects",
          href: `/owner/projects`,
          icon: FolderKanban,
          visible: true,
        },
        {
          name: "Members",
          href: `/owner/members`,
          icon: Users,
          visible: true,
          children: (isOwner || isAdmin) ? [
            {
              name: "Invitations",
              href: `/owner/members/invitations`,
              icon: UserPlus,
            },
          ] : undefined,
        },
      ],
    },
    {
      label: "Billing & Revenue",
      visible: isOwner,
      items: [
        {
          name: "Subscription",
          href: `/owner/billing`,
          icon: CreditCard,
          visible: isOwner,
          children: [
            {
              name: "Invoices",
              href: `/owner/billing/invoices`,
              icon: FileText,
            },
          ],
        },
      ],
    },
    {
      label: "Operations",
      items: [
        {
          name: "Integrations",
          href: `/owner/integrations`,
          icon: Puzzle,
          visible: isOwner || isAdmin,
        },
        {
          name: "Notifications",
          href: `/owner/notifications`,
          icon: Bell,
          visible: true,
        },
        {
          name: "Activity Log",
          href: `/owner/activity`,
          icon: Activity,
          visible: isOwner || isAdmin,
        },
      ],
    },
    {
      label: "Settings",
      visible: true,
      items: [
        {
          name: "General",
          href: `/owner/settings/general`,
          icon: Settings,
          visible: isOwner,
        },
        {
          name: "Roles & Permissions",
          href: `/owner/settings/roles`,
          icon: Shield,
          visible: isOwner,
        },
        {
          name: "Security",
          href: `/owner/settings/security`,
          icon: Shield,
          visible: true,
        },
        {
          name: "Danger Zone",
          href: `/owner/settings/danger-zone`,
          icon: AlertTriangle,
          visible: isOwner,
        },
      ],
    },
  ];

  return (
    <aside className={cn("w-64 bg-card border-r border-border flex flex-col h-full text-foreground select-none transition-all duration-200", className)}>
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {navGroups.map((group, groupIdx) => {
          if (group.visible === false) return null;
          const visibleItems = group.items.filter((item) => item.visible);
          if (visibleItems.length === 0) return null;

          return (
            <div key={groupIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-2">
                {group.label}
              </p>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/owner/dashboard" && pathname.startsWith(item.href + "/"));

                return (
                  <div key={item.name} className="space-y-1">
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150 group",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold shadow-xs ring-1 ring-primary/20"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                      <span className="truncate">{item.name}</span>
                    </Link>

                    {item.children && (
                      <div className="pl-6 space-y-0.5 pt-0.5 border-l border-border/40 ml-4">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={onNavigate}
                              className={cn(
                                "flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-colors",
                                isChildActive
                                  ? "text-primary font-semibold bg-primary/10"
                                  : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/50"
                              )}
                            >
                              <ChildIcon className="size-3.5" />
                              <span>{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer: System Status & User Profile Link */}
      <div className="p-3 border-t border-border mt-auto space-y-2">
        <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-medium text-muted-foreground bg-muted/40 rounded-md border border-border/50">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational</span>
          </span>
          <span className="text-muted-foreground/60 uppercase font-mono tracking-wider">{role}</span>
        </div>

        <Link
          href={`/owner/profile`}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors group",
            pathname === `/owner/profile`
              ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          )}
        >
          <div className="size-5 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px]">
            P
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium group-hover:text-foreground transition-colors">Your Profile</p>
          </div>
        </Link>
      </div>
    </aside>
  );

}