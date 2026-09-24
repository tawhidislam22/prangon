"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  userImage?: string;
}

export function AdminLayoutClient({
  children,
  userEmail,
  userName,
  userRole,
  userImage,
}: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar
          userEmail={userEmail}
          userName={userName}
          userRole={userRole}
          userImage={userImage}
        />
      </div>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-card border-border">
          <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">Platform administration navigation sidebar</SheetDescription>
          <AdminSidebar
            userEmail={userEmail}
            userName={userName}
            userRole={userRole}
            userImage={userImage}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar
          userEmail={userEmail}
          userName={userName}
          userRole={userRole}
          userImage={userImage}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
