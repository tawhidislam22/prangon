import React from "react";
import Link from "next/link";
import { PrangonLogo } from "@/components/PrangonLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cobalt/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-cobalt/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        <Link href="/" className="mb-8 block">
          <PrangonLogo size={36} textClassName="text-3xl font-bold tracking-tight text-paper" />
        </Link>
        {children}
      </div>
    </div>
  );
}
