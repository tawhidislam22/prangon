import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
  };
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-line rounded-xl bg-white/50">
      <div className="p-3 rounded-full bg-ink/5 text-graphite mb-4">
        <Icon className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-ink font-display">{title}</h3>
      <p className="mt-1 text-sm text-graphite max-w-sm">{description}</p>
      {action && action.href && (
        <div className="mt-5">
          <Button asChild size="sm" className="bg-cobalt hover:bg-cobalt/90 text-white">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        </div>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}