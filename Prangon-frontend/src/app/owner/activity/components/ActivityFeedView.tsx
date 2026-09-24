"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/app/EmptyState";
import { Activity, Clock, User, Search, Filter, Calendar } from "lucide-react";

interface ActivityItem {
  id?: string;
  action?: string;
  description?: string;
  entityType?: string;
  createdAt?: string;
  user?: {
    name?: string;
    email?: string;
  };
}

export function ActivityFeedView({ initialActivities }: { initialActivities: ActivityItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");

  const filteredActivities = useMemo(() => {
    return initialActivities.filter((item) => {
      const q = searchQuery.toLowerCase();
      const actionText = (item.action || item.description || "").toLowerCase();
      const userName = (item.user?.name || item.user?.email || "").toLowerCase();
      const matchesSearch = !q || actionText.includes(q) || userName.includes(q);

      if (!matchesSearch) return false;

      if (entityFilter !== "all") {
        const lowerAction = actionText.toLowerCase();
        if (entityFilter === "project" && !lowerAction.includes("project")) return false;
        if (entityFilter === "task" && !lowerAction.includes("task")) return false;
        if (entityFilter === "member" && !lowerAction.includes("member") && !lowerAction.includes("invite")) return false;
        if (entityFilter === "workspace" && !lowerAction.includes("workspace")) return false;
      }

      return true;
    });
  }, [initialActivities, searchQuery, entityFilter]);

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action or user..."
            className="pl-9 h-9 text-xs border-line bg-card"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-3.5 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="h-9 text-xs w-full sm:w-44 border-line bg-card">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="task">Tasks</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
              <SelectItem value="member">Members & Roles</SelectItem>
              <SelectItem value="workspace">Workspace</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity Timeline Card */}
      <Card className="border border-line bg-card shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {filteredActivities.length > 0 ? (
            <div className="divide-y divide-line/60">
              {filteredActivities.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 sm:p-5 flex items-start gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="size-8 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="size-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs font-semibold text-foreground">
                      {item.action || item.description || "Workspace event occurred"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      {item.user && (
                        <span className="flex items-center gap-1 font-medium text-foreground/80">
                          <User className="size-3 text-muted-foreground" />
                          <span>{item.user.name || item.user.email}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-muted-foreground" />
                        <span>
                          {new Date(item.createdAt || Date.now()).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12">
              <EmptyState
                icon={Activity}
                title={searchQuery || entityFilter !== "all" ? "No matching events" : "No activity recorded yet"}
                description={
                  searchQuery || entityFilter !== "all"
                    ? "Try adjusting your search query or filter."
                    : "When members create projects, complete tasks, or update settings, real-time audit logs will appear here."
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
