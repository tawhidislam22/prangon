import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { getUserInfo, logoutUser } from "@/services/auth.services";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { PrangonLogo } from "@/components/PrangonLogo";

import { httpClient } from "@/lib/axios/httpClient";

export async function Navbar() {
  const userInfo = await getUserInfo();

  let dashboardRoute = "/dashboard";
  if (userInfo?.role === "SUPER_ADMIN") {
    dashboardRoute = "/admin/dashboard";
  } else if (userInfo) {
    if (userInfo.role === "MEMBER") {
      dashboardRoute = "/dashboard";
    } else {
      try {
        const res = await httpClient.get<any[]>("/workspaces");
        if (res.data && res.data.length > 0) {
          dashboardRoute = `/owner/dashboard`;
        }
      } catch {
        dashboardRoute = "/dashboard";
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md text-foreground transition-colors">
      <div className="container mx-auto px-4 sm:px-6 xl:px-12 h-16 flex items-center justify-between max-w-[1400px]">
        <Link href="/" className="tracking-tight">
          <PrangonLogo size={28} textClassName="text-xl font-bold tracking-tight text-foreground" />
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Security</Link>
          <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
        </nav>
        <div className="flex items-center gap-4">
          {userInfo ? (
            <>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-xs font-medium">
                <Link href={dashboardRoute}>Dashboard</Link>
              </Button>
              <form action={logoutUser}>
                <Button type="submit" variant="outline" className="rounded-lg text-destructive hover:bg-destructive/10 border-border">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Login</Link>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-xs font-medium">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
