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
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
        {/* Left: Mobile hamburger & Workspace Switcher */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden size-8"
            onClick={onOpenMobileMenu}
          >
            <Menu className="size-4" />
          </Button>

          {/* Workspace Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5 gap-2 bg-background border-border hover:bg-muted/60 font-medium text-xs rounded-lg transition-colors shadow-2xs"
              >
                <div className="size-5 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] ring-1 ring-primary/20">
                  {workspaceName.charAt(0).toUpperCase()}
                </div>
                <span className="truncate max-w-[130px] font-semibold text-foreground">
                  {workspaceName}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary hidden sm:inline-block">
                  {role}
                </span>
                <ChevronsUpDown className="size-3 text-muted-foreground ml-auto opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60 shadow-lg border-border">
              <DropdownMenuLabel className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                Switch Workspace
              </DropdownMenuLabel>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.slug}
                  onClick={async () => {
                    await setActiveWorkspaceAction(ws.slug);
                    router.push(role === "MEMBER" ? "/dashboard" : `/owner/dashboard`);
                  }}
                  className="cursor-pointer gap-2.5 text-xs py-2"
                >
                  <div className="size-5 rounded bg-muted flex items-center justify-center font-bold text-[10px] text-muted-foreground">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate font-medium">{ws.name}</span>
                  {ws.slug === workspaceSlug && (
                    <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold border border-primary/20">
                      Active
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/workspaces/create")}
                className="cursor-pointer gap-2 text-xs text-primary font-medium hover:bg-primary/5 focus:bg-primary/5"
              >
                <Plus className="size-3.5" />
                <span>Create Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Search trigger (⌘K) */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground bg-muted/40 hover:bg-muted/80 border border-border/80 rounded-lg transition-all shadow-2xs group"
          >
            <span className="flex items-center gap-2">
              <Search className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="group-hover:text-foreground transition-colors">Search projects, tasks, members...</span>
            </span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-2xs">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Notifications, ModeToggle, Avatar */}
        <div className="flex items-center gap-2">
          {/* Quick Create Action */}
          <Link href={`/owner/projects`} className="hidden md:flex">
            <Button size="sm" className="h-8 px-2.5 gap-1.5 text-xs font-medium shadow-xs">
              <Plus className="size-3.5" />
              <span>New Project</span>
            </Button>
          </Link>

          <Link href={`/owner/notifications`}>
            <Button variant="ghost" size="icon" className="relative size-8 text-muted-foreground hover:text-foreground">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 bg-primary rounded-full ring-2 ring-card" />
            </Button>
          </Link>

          <ModeToggle />

          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 rounded-full ring-1 ring-border p-0 overflow-hidden hover:ring-primary/40 transition-all">
                <div className="size-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                  {userName.charAt(0)}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 shadow-lg border-border">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold leading-none text-foreground">{userName}</p>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                      {role}
                    </span>
                  </div>
                  <p className="text-[11px] leading-none text-muted-foreground truncate">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer text-xs">
                <Link href={`/owner/profile`} className="flex items-center gap-2">
                  <User className="size-3.5 text-muted-foreground" />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logoutUser()}
                className="cursor-pointer text-xs text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 flex items-center gap-2"
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