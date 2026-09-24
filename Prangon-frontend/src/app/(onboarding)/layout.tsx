import React from "react";
import Link from "next/link";
import { PrangonLogo } from "@/components/PrangonLogo";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="w-full max-w-3xl z-10 flex flex-col items-center">
        <Link href="/" className="mb-8 block">
          <PrangonLogo size={36} textClassName="text-3xl font-bold tracking-tight text-ink" />
        </Link>
        {children}
      </div>
    </div>
  );
}
