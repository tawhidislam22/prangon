import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  actions,
  badge,
}: PageHeaderProps) {
  const actionSlot = actions || action;
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line mb-8">
      <div className="space-y-1.5">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-graphite mb-2">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="size-3 text-graphite/40" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-ink transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
            {title}
          </h1>
          {badge}
        </div>

        {description && (
          <p className="text-sm text-graphite max-w-2xl">{description}</p>
        )}
      </div>

      {actionSlot && <div className="flex items-center gap-2 shrink-0">{actionSlot}</div>}
    </div>
  );
}