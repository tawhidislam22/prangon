"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Shield,
  LogOut,
  User,
  Menu,
  Search,
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  ClipboardList,
  MailCheck,
  ShieldAlert,
} from "lucide-react";
import { logoutUser } from "@/services/auth.services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { AdminNotificationDropdown } from "./AdminNotificationDropdown";

interface AdminTopbarProps {
  userEmail?: string;
  userName?: string;
  userRole?: string;
  userImage?: string;
  onOpenMobileMenu?: () => void;
}

export function AdminTopbar({
  userEmail = "admin@prangon.internal",
  userName = "Platform Admin",
  userRole = "SUPER_ADMIN",
  userImage,
  onOpenMobileMenu,
}: AdminTopbarProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigateTo = (path: string) => {
    setSearchOpen(false);
    router.push(path);
  };

  const initials = userName
    ? userName
        .trim()
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2)
    : "PA";

  return (
    <>
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none transition-colors">
        {/* Left side: Hamburger & Context */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:bg-accent"
            onClick={onOpenMobileMenu}
          >
            <Menu className="size-5" />
          </Button>

          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider">
              Platform Admin
            </Badge>
            <span className="hidden sm:inline text-xs text-muted-foreground font-medium">
              Staff Console
            </span>
          </div>
        </div>

        {/* Center: Quick Search Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground bg-muted/40 hover:bg-muted/70 border border-border rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="size-3.5" />
              <span>Search platform, tenants, requests...</span>
            </span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right side: Notifications, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Notifications */}
          <AdminNotificationDropdown />

          {/* Theme Changer */}
          <ModeToggle />

          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2.5 bg-card hover:bg-accent text-foreground border-border rounded-lg h-9 px-3"
              >
                <Avatar className="size-6">
                  <AvatarImage src={userImage || undefined} alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-[10px] uppercase">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-semibold text-foreground max-w-[120px] truncate hidden sm:inline">
                  {userName}
                </span>
                <Badge variant="secondary" className="text-[10px] font-bold border-none ml-0.5">
                  {userRole}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border-border text-popover-foreground">
              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground py-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="font-semibold text-foreground">{userName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logoutUser()}
                className="cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center gap-2"
              >
                <LogOut className="size-3.5" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Quick Command Palette (Cmd+K) */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search admin console..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Platform Navigation">
            <CommandItem onSelect={() => navigateTo("/admin/dashboard")}>
              <LayoutDashboard className="mr-2 size-4 text-primary" />
              <span>Dashboard Overview</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/admin/workspaces")}>
              <Building2 className="mr-2 size-4 text-primary" />
              <span>Tenant Workspaces Directory</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/admin/users")}>
              <Users className="mr-2 size-4 text-primary" />
              <span>User Directory</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/admin/subscriptions")}>
              <CreditCard className="mr-2 size-4 text-primary" />
              <span>Subscriptions & MRR</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Operations & Security">
            <CommandItem onSelect={() => navigateTo("/admin/requests")}>
              <ClipboardList className="mr-2 size-4 text-amber-500" />
              <span>Admin Account Requests</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/admin/emails")}>
              <MailCheck className="mr-2 size-4 text-emerald-500" />
              <span>Email Diagnostics Console</span>
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/admin/audit-log")}>
              <ShieldAlert className="mr-2 size-4 text-indigo-500" />
              <span>Platform Audit Trail</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
