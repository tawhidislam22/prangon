"use client";

import React from "react";
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
  ArrowLeft,
  Shield,
  MailCheck,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Email Console",
      href: "/admin/emails",
      icon: MailCheck,
    },
    {
      name: "Workspaces",
      href: "/admin/workspaces",
      icon: Building2,
    },
    {
      name: "Users Directory",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Subscriptions",
      href: "/admin/subscriptions",
      icon: CreditCard,
    },
    {
      name: "Admin Requests",
      href: "/admin/requests",
      icon: ClipboardList,
    },
    {
      name: "Audit Log",
      href: "/admin/audit-log",
      icon: ShieldAlert,
    },
  ];

  return (
    <aside className="w-64 bg-[#0B0F17] border-r border-slate-800 text-slate-300 flex flex-col h-full select-none shrink-0">
      {/* Platform Admin Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800">
        <div className="size-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
          <Shield className="size-4" />
        </div>
        <div>
          <span className="text-sm font-bold text-white tracking-tight">PRANGON</span>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Staff Console
            </span>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Platform Governance
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-indigo-600 text-white font-semibold shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive ? "text-white" : "text-slate-400"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer / Back to Tenant App */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Exit to Customer App</span>
        </Link>
      </div>
    </aside>
  );
}
