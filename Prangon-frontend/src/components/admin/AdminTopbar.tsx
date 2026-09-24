"use client";

import React from "react";
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
import { Shield, LogOut, User, Menu } from "lucide-react";
import { logoutUser } from "@/services/auth.services";

interface AdminTopbarProps {
  userEmail?: string;
  userName?: string;
  userRole?: string;
  onOpenMobileMenu?: () => void;
}

export function AdminTopbar({
  userEmail = "admin@prangon.internal",
  userName = "Platform Admin",
  userRole = "SUPER_ADMIN",
  onOpenMobileMenu,
}: AdminTopbarProps) {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0F1420] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-300 hover:text-white"
          onClick={onOpenMobileMenu}
        >
          <Menu className="size-5" />
        </Button>

        <div className="flex items-center gap-2">
          <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider">
            Internal Staff Tool
          </Badge>
          <span className="hidden sm:inline text-xs text-slate-400">
            Cross-Tenant Isolation Bypass Active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/60 rounded-lg h-9 px-3"
            >
              <div className="size-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                {userName.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-white">{userName}</span>
              <Badge className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border-none ml-1">
                {userRole}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#161B26] border-slate-800 text-slate-200">
            <DropdownMenuLabel className="font-normal text-xs text-slate-400">
              <div className="flex flex-col space-y-0.5">
                <p className="font-semibold text-white">{userName}</p>
                <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              onClick={() => logoutUser()}
              className="cursor-pointer text-xs text-red-400 focus:text-red-400 focus:bg-red-500/10 flex items-center gap-2"
            >
              <LogOut className="size-3.5" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
