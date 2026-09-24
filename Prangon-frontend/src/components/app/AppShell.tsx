"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AppWorkspaceRole } from "./RoleGate";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface AppShellProps {
  children: React.ReactNode;
  workspaceSlug: string;
  workspaceName: string;
  role: AppWorkspaceRole;
  userEmail?: string;
  userName?: string;
  workspaces?: Array<{ id: string; name: string; slug: string }>;
}

export function AppShell({
  children,
  workspaceSlug,
  workspaceName,
  role,
  userEmail,
  userName,
  workspaces,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar workspaceSlug={workspaceSlug} role={role} />
      </div>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar
            workspaceSlug={workspaceSlug}
            role={role}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          workspaceSlug={workspaceSlug}
          workspaceName={workspaceName}
          userEmail={userEmail}
          userName={userName}
          workspaces={workspaces}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}