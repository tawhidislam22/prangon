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
          href: `/w/${workspaceSlug}/dashboard`,
          icon: LayoutDashboard,
          visible: true,
        },
        {
          name: "Projects",
          href: `/w/${workspaceSlug}/projects`,
          icon: FolderKanban,
          visible: true,
        },
        {
          name: "Members",
          href: `/w/${workspaceSlug}/members`,
          icon: Users,
          visible: isOwner || isAdmin,
          children: [
            {
              name: "Invitations",
              href: `/w/${workspaceSlug}/members/invitations`,
              icon: UserPlus,
            },
          ],
        },
      ],
    },
    {
      label: "Billing & Revenue",
      visible: isOwner,
      items: [
        {
          name: "Subscription",
          href: `/w/${workspaceSlug}/billing`,
          icon: CreditCard,
          visible: isOwner,
          children: [
            {
              name: "Invoices",
              href: `/w/${workspaceSlug}/billing/invoices`,
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
          href: `/w/${workspaceSlug}/integrations`,
          icon: Puzzle,
          visible: isOwner || isAdmin,
        },
        {
          name: "Notifications",
          href: `/w/${workspaceSlug}/notifications`,
          icon: Bell,
          visible: true,
        },
        {
          name: "Activity Log",
          href: `/w/${workspaceSlug}/activity`,
          icon: Activity,
          visible: isOwner || isAdmin,
        },
      ],
    },
    {
      label: "Settings",
      visible: isOwner || isAdmin,
      items: [
        {
          name: "General",
          href: `/w/${workspaceSlug}/settings/general`,
          icon: Settings,
          visible: isOwner,
        },
        {
          name: "Roles & Permissions",
          href: `/w/${workspaceSlug}/settings/roles`,
          icon: Shield,
          visible: isOwner,
        },
        {
          name: "Security",
          href: `/w/${workspaceSlug}/settings/security`,
          icon: Shield,
          visible: isOwner || isAdmin,
        },
        {
          name: "Danger Zone",
          href: `/w/${workspaceSlug}/settings/danger-zone`,
          icon: AlertTriangle,
          visible: isOwner,
        },
      ],
    },
  ];

  return (
    <aside className={cn("w-64 bg-card border-r border-border flex flex-col h-full text-foreground select-none", className)}>
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {navGroups.map((group, groupIdx) => {
          if (group.visible === false) return null;
          const visibleItems = group.items.filter((item) => item.visible);
          if (visibleItems.length === 0) return null;

          return (
            <div key={groupIdx} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
                {group.label}
              </p>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <div key={item.name} className="space-y-1">
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-cobalt text-white font-semibold shadow-xs"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0", isActive ? "text-white" : "text-muted-foreground")} />
                      <span>{item.name}</span>
                    </Link>

                    {item.children && (
                      <div className="pl-6 space-y-0.5 pt-0.5">
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
                                  ? "text-cobalt font-semibold bg-cobalt/10"
                                  : "text-muted-foreground/80 hover:text-foreground hover:bg-accent/60"
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

      {/* Sidebar Footer: [Your profile] */}
      <div className="p-3 border-t border-border mt-auto">
        <Link
          href={`/w/${workspaceSlug}/profile`}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors",
            pathname === `/w/${workspaceSlug}/profile`
              ? "bg-cobalt text-white font-semibold"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <div className="size-5 rounded-full bg-cobalt/20 text-cobalt flex items-center justify-center font-bold text-[10px]">
            P
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium">Your Profile</p>
          </div>
        </Link>
      </div>
    </aside>
  );

}