"use client";

import React from "react";
import Link from "next/link";
import { logoutUser } from "@/services/auth.services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, User, Settings, LogOut, Shield } from "lucide-react";

export interface UserNavProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    avatarUrl?: string;
  };
  dashboardRoute: string;
}

export function UserNav({ user, dashboardRoute }: UserNavProps) {
  const displayName = user.name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex items-center justify-center size-9 rounded-full ring-1 ring-border/80 hover:ring-primary/60 hover:scale-105 transition-all p-0 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
          aria-label="User account menu"
        >
          <Avatar className="size-9">
            <AvatarImage src={user.avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 p-1.5 shadow-2xl border-border bg-card text-card-foreground rounded-xl"
      >
        <DropdownMenuLabel className="font-normal p-2.5 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 ring-1 ring-border shrink-0">
              <AvatarImage src={user.avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm uppercase">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5 min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user.email}
              </p>
              <div className="pt-0.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  <Shield className="size-2.5" />
                  {user.role || "MEMBER"}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-border/70" />
        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem
            asChild
            className="cursor-pointer text-xs font-medium py-2 px-2.5 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors"
          >
            <Link href={dashboardRoute} className="flex items-center gap-2.5 w-full">
              <LayoutDashboard className="size-4 text-muted-foreground" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="cursor-pointer text-xs font-medium py-2 px-2.5 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors"
          >
            <Link href="/my-profile" className="flex items-center gap-2.5 w-full">
              <User className="size-4 text-muted-foreground" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>

          {user.role === "OWNER" || user.role === "SUPER_ADMIN" ? (
            <DropdownMenuItem
              asChild
              className="cursor-pointer text-xs font-medium py-2 px-2.5 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors"
            >
              <Link href="/owner/settings/general" className="flex items-center gap-2.5 w-full">
                <Settings className="size-4 text-muted-foreground" />
                <span>Workspace Settings</span>
              </Link>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1 bg-border/70" />
        <form action={logoutUser} className="w-full">
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors"
          >
            <LogOut className="size-4 text-destructive" />
            <span>Log out</span>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
