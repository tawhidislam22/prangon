import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { getUserInfo, logoutUser } from "@/services/auth.services";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { PrangonLogo } from "@/components/PrangonLogo";

export async function Navbar() {
  const userInfo = await getUserInfo();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-paper text-ink">
      <div className="container mx-auto px-4 sm:px-6 xl:px-12 h-16 flex items-center justify-between max-w-[1400px]">
        <Link href="/" className="font-display tracking-tight">
          <PrangonLogo size={28} textClassName="text-xl font-bold tracking-tight text-ink" />
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-sm font-medium hover:text-cobalt transition-colors">Home</Link>
          <Link href="/features" className="text-sm font-medium hover:text-cobalt transition-colors">Features</Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-cobalt transition-colors">Pricing</Link>
          <Link href="/security" className="text-sm font-medium hover:text-cobalt transition-colors">Security</Link>
          <Link href="/docs" className="text-sm font-medium hover:text-cobalt transition-colors">Docs</Link>
        </nav>
        <div className="flex items-center gap-4">
          {userInfo ? (
            <>
              <Button asChild className="bg-cobalt hover:bg-cobalt/90 text-white rounded-md">
                <Link href={getDefaultDashboardRoute(userInfo.role)}>Dashboard</Link>
              </Button>
              <form action={logoutUser}>
                <Button type="submit" variant="outline" className="rounded-md text-red-600 hover:text-red-700">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-cobalt transition-colors">Login</Link>
              <Button asChild className="bg-cobalt hover:bg-cobalt/90 text-white rounded-md">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
