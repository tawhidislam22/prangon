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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border/70 mb-6">
      <div className="space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="size-3 text-muted-foreground/40" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          {badge}
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>

      {actionSlot && <div className="flex items-center gap-2 shrink-0">{actionSlot}</div>}
    </div>
  );
}