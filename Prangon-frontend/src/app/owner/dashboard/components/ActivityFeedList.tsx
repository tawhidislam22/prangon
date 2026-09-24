"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowRight, User } from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";

interface ActivityFeedListProps {
  
  workspaceSlug?: string;
  activities: Array<{
    id: string;
    action: string;
    details?: string | null;
    createdAt: string;
    user?: {
      id: string;
      name: string | null;
      email: string;
      image?: string | null;
    } | null;
  }>;
}

export function ActivityFeedList({
  workspaceSlug,
  activities,
}: ActivityFeedListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Activity className="size-4 text-cobalt" />
          Recent Workspace Activity
        </h2>
        <Link
          href={`/owner/activity`}
          className="text-xs font-semibold text-cobalt hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <Card className="border border-border bg-card shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {activities.length > 0 ? (
            <div className="divide-y divide-border/60">
              {activities.slice(0, 10).map((log, index) => {
                const userName = log.user?.name || log.user?.email || "Team member";
                return (
                  <div
                    key={log.id || index}
                    className="p-3.5 flex items-start gap-3 hover:bg-muted/30 transition-colors text-xs"
                  >
                    <div className="size-7 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center font-bold text-[11px] shrink-0 uppercase">
                      {userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">
                        <span className="text-cobalt">{userName}</span>{" "}
                        <span className="font-normal text-muted-foreground">{log.action.toLowerCase()}</span>
                      </p>
                      {log.details && (
                        <p className="text-muted-foreground text-[11px] truncate mt-0.5">
                          {log.details}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <EmptyState
                icon={Activity}
                title="No recent activity yet"
                description="Actions taken by team members on projects and tasks will appear here in real time."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
