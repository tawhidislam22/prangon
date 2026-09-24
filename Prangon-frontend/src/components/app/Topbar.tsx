"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setActiveWorkspaceAction } from "@/app/owner/workspaceActions";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
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
  Building2,
  ChevronsUpDown,
  Search,
  Bell,
  User,
  LogOut,
  Plus,
  Menu,
} from "lucide-react";
import { logoutUser } from "@/services/auth.services";

interface TopbarProps {
  workspaceSlug: string;
  workspaceName: string;
  role?: string;
  userEmail?: string;
  userName?: string;
  workspaces?: Array<{ id: string; name: string; slug: string }>;
  onOpenMobileMenu?: () => void;
}

export function Topbar({
  workspaceSlug,
  workspaceName,
  role = "OWNER",
  userEmail = "user@example.com",
  userName = "User",
  workspaces = [],
  onOpenMobileMenu,
}: TopbarProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut Cmd+K / Ctrl+K
  React.useEffect(() => {
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

  return (
    <>
      <header className="h-16 border-b border-border bg-card px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
        {/* Left: Mobile hamburger & Workspace Switcher */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onOpenMobileMenu}
          >
            <Menu className="size-5" />
          </Button>

          {/* Workspace Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3 gap-2.5 bg-background border-border hover:bg-accent font-medium text-xs rounded-lg"
              >
                <div className="size-5 rounded bg-cobalt/10 text-cobalt flex items-center justify-center font-bold text-[11px]">
                  {workspaceName.charAt(0).toUpperCase()}
                </div>
                <span className="truncate max-w-[140px] font-semibold text-foreground">
                  {workspaceName}
                </span>
                <ChevronsUpDown className="size-3.5 text-muted-foreground ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                Workspaces
              </DropdownMenuLabel>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.slug}
                  onClick={async () => {
                    await setActiveWorkspaceAction(ws.slug);
                    router.push(role === "MEMBER" ? "/dashboard" : `/owner/dashboard`);
                  }}
                  className="cursor-pointer gap-2 text-xs"
                >
                  <Building2 className="size-3.5 text-muted-foreground" />
                  <span className="truncate">{ws.name}</span>
                  {ws.slug === workspaceSlug && (
                    <span className="ml-auto text-[10px] bg-cobalt/10 text-cobalt px-1.5 py-0.5 rounded font-semibold">
                      Current
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/workspaces/create")}
                className="cursor-pointer gap-2 text-xs text-cobalt font-medium"
              >
                <Plus className="size-3.5" />
                <span>Create Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Search trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground bg-muted/50 hover:bg-muted border border-border/70 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="size-3.5" />
              <span>Search projects, tasks, members...</span>
            </span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Notifications, ModeToggle, Avatar */}
        <div className="flex items-center gap-2">
          <Link href={`/owner/notifications`}>
            <Button variant="ghost" size="icon" className="relative size-9">
              <Bell className="size-4 text-muted-foreground" />
              <span className="absolute top-2 right-2 size-2 bg-cobalt rounded-full ring-2 ring-card" />
            </Button>
          </Link>

          <ModeToggle />

          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9 rounded-full bg-accent/60">
                <div className="size-7 rounded-full bg-cobalt text-white flex items-center justify-center font-bold text-xs uppercase">
                  {userName.charAt(0)}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-semibold leading-none text-foreground">{userName}</p>
                  <p className="text-[11px] leading-none text-muted-foreground truncate">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer text-xs">
                <Link href={`/owner/profile`} className="flex items-center gap-2">
                  <User className="size-3.5" />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logoutUser()}
                className="cursor-pointer text-xs text-red-600 focus:text-red-600 flex items-center gap-2"
              >
                <LogOut className="size-3.5" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Command Palette (⌘K) */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => navigateTo(`/owner/dashboard`)}>
              Dashboard Overview
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/projects`)}>
              Projects Board
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/members`)}>
              Team Members
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/members/invitations`)}>
              Pending Invitations
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/billing`)}>
              Billing & Subscription
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/billing/invoices`)}>
              Invoices & Receipts
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/integrations`)}>
              Connected Apps
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/notifications`)}>
              Notifications
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/activity`)}>
              Workspace Activity Log
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => navigateTo(`/owner/settings/general`)}>
              General Workspace Settings
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/settings/roles`)}>
              Roles & Permissions Matrix
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/settings/security`)}>
              Security & Active Sessions
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/settings/danger-zone`)}>
              Danger Zone
            </CommandItem>
            <CommandItem onSelect={() => navigateTo(`/owner/profile`)}>
              Personal Profile
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}