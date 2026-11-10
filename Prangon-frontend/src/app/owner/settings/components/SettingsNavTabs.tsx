"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Shield, Lock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsNavTabsProps {
  
  workspaceSlug?: string;
  isOwner?: boolean;
}

export function SettingsNavTabs({ workspaceSlug, isOwner = true }: SettingsNavTabsProps) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "General Details",
      href: `/owner/settings/general`,
      icon: Settings,
      visible: isOwner,
    },
    {
      label: "Roles & Permissions",
      href: `/owner/settings/roles`,
      icon: Shield,
      visible: isOwner,
    },
    {
      label: "Security & Sessions",
      href: `/owner/settings/security`,
      icon: Lock,
      visible: true,
    },
    {
      label: "Danger Zone",
      href: `/owner/settings/danger-zone`,
      icon: AlertTriangle,
      visible: isOwner,
      danger: true,
    },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
      {tabs
        .filter((tab) => tab.visible)
        .map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0",
                isActive
                  ? tab.danger
                    ? "bg-red-500/10 text-red-600 border border-red-500/20 shadow-2xs"
                    : "bg-primary text-primary-foreground shadow-2xs"
                  : tab.danger
                  ? "text-red-500 hover:text-red-600 hover:bg-red-500/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
    </div>
  );
}
