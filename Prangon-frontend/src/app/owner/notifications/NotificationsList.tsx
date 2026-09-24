"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCircle2, Bell, CheckCheck, Inbox } from "lucide-react";
import { markNotificationAsReadAction, markAllNotificationsAsReadAction } from "./actions";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";

export function NotificationsList({ 
  initialNotifications 
}: { 
  
  initialNotifications: any[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isPending, startTransition] = useTransition();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    startTransition(async () => {
      const res = await markNotificationAsReadAction( id);
      if (!res.success) {
        toast.error("Failed to mark as read");
      }
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    startTransition(async () => {
      const res = await markAllNotificationsAsReadAction();
      if (res.success) {
        toast.success("All marked as read");
      } else {
        toast.error("Failed to mark all as read");
      }
    });
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Tab controls and actions */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5",
              filter === "all"
                ? "bg-cobalt text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <span>All</span>
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px] px-1.5 py-0 h-4 border-none",
                filter === "all" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {notifications.length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5",
              filter === "unread"
                ? "bg-cobalt text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center size-4 text-[10px] font-bold rounded-full bg-red-500 text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isPending}
            className="text-xs h-8 gap-1.5 border-line hover:border-cobalt/40"
          >
            <CheckCheck className="size-3.5 text-cobalt" />
            <span>Mark all read</span>
          </Button>
        )}
      </div>

      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={filter === "unread" ? CheckCircle2 : Inbox}
          title={filter === "unread" ? "All caught up!" : "No notifications"}
          description={
            filter === "unread"
              ? "You have no unread notifications at the moment."
              : "Notifications for assignments, mentions, and updates will appear here."
          }
        />
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "border transition-all shadow-xs",
                notification.isRead
                  ? "bg-card/50 border-border/60 opacity-80"
                  : "bg-card border-cobalt/30 ring-1 ring-cobalt/10"
              )}
            >
              <CardContent className="p-4 flex items-start gap-3.5">
                <div
                  className={cn(
                    "mt-0.5 p-2 rounded-full shrink-0",
                    notification.isRead
                      ? "bg-muted text-muted-foreground"
                      : "bg-cobalt/10 text-cobalt"
                  )}
                >
                  <Bell className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={cn(
                        "text-xs font-semibold truncate",
                        notification.isRead ? "text-muted-foreground" : "text-foreground font-bold"
                      )}
                    >
                      {notification.title || "Notification"}
                    </h4>
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {new Date(notification.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-cobalt hover:bg-cobalt/10"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={isPending}
                    title="Mark as read"
                  >
                    <Check className="size-3.5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
