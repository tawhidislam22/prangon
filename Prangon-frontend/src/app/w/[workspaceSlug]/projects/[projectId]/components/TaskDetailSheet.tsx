"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  MessageSquare,
  Activity,
  Send,
  Trash2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { getTaskById, updateTask, addTaskComment } from "@/services/task.services";
import { toast } from "sonner";

interface TaskDetailSheetProps {
  workspaceSlug: string;
  projectId: string;
  taskId: string | null;
  onClose: () => void;
  onTaskUpdated?: () => void;
}

export function TaskDetailSheet({
  workspaceSlug,
  projectId,
  taskId,
  onClose,
  onTaskUpdated,
}: TaskDetailSheetProps) {
  const router = useRouter();
  const [task, setTask] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDesc, setEditingDesc] = useState("");

  const isOpen = Boolean(taskId);

  useEffect(() => {
    if (!taskId) {
      setTask(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getTaskById(taskId)
      .then((res: any) => {
        if (isMounted && res.success && res.data) {
          setTask(res.data);
          setEditingTitle(res.data.title || "");
          setEditingDesc(res.data.description || "");
        }
      })
      .catch((err) => {
        console.error("Error fetching task details:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [taskId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!taskId) return;
    setTask((prev: any) => (prev ? { ...prev, status: newStatus } : prev));
    try {
      const res = await updateTask(taskId, { status: newStatus });
      if (res.success) {
        toast.success("Task status updated");
        if (onTaskUpdated) onTaskUpdated();
        router.refresh();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!taskId) return;
    setTask((prev: any) => (prev ? { ...prev, priority: newPriority } : prev));
    try {
      const res = await updateTask(taskId, { priority: newPriority });
      if (res.success) {
        toast.success("Priority updated");
        if (onTaskUpdated) onTaskUpdated();
        router.refresh();
      } else {
        toast.error("Failed to update priority");
      }
    } catch {
      toast.error("Failed to update priority");
    }
  };

  const handleTitleBlur = async () => {
    if (!taskId || editingTitle === task?.title) return;
    try {
      const res = await updateTask(taskId, { title: editingTitle });
      if (res.success) {
        setTask((prev: any) => (prev ? { ...prev, title: editingTitle } : prev));
        toast.success("Title saved");
        if (onTaskUpdated) onTaskUpdated();
        router.refresh();
      } else {
        toast.error("Failed to save title");
      }
    } catch {
      toast.error("Failed to save title");
    }
  };

  const handleDescBlur = async () => {
    if (!taskId || editingDesc === task?.description) return;
    try {
      const res = await updateTask(taskId, { description: editingDesc });
      if (res.success) {
        setTask((prev: any) => (prev ? { ...prev, description: editingDesc } : prev));
        toast.success("Description saved");
        if (onTaskUpdated) onTaskUpdated();
      } else {
        toast.error("Failed to save description");
      }
    } catch {
      toast.error("Failed to save description");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !taskId) return;

    setCommentSubmitting(true);
    try {
      const res: any = await addTaskComment(taskId, commentText.trim());
      if (res.success && res.data) {
        setTask((prev: any) =>
          prev
            ? {
                ...prev,
                comments: [...(prev.comments || []), res.data],
              }
            : prev
        );
        setCommentText("");
        toast.success("Comment added");
      } else {
        toast.error(res.message || "Failed to post comment");
      }
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col h-full bg-card overflow-hidden">
        <SheetHeader className="p-6 pb-4 border-b border-border bg-muted/10">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Task Details
            </span>
            {task && (
              <Badge variant="outline" className="text-xs font-semibold">
                {task.status}
              </Badge>
            )}
          </div>

          <div className="mt-2">
            <Input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Task title..."
              className="text-lg font-bold border-none px-0 h-auto focus-visible:ring-0 focus-visible:border-b rounded-none shadow-none text-foreground"
            />
          </div>
        </SheetHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-cobalt" />
          </div>
        ) : task ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Properties Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/20 border border-border/80 text-xs">
              <div className="space-y-1.5">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Clock className="size-3.5 text-cobalt" />
                  Status
                </span>
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-8 text-xs bg-card">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Activity className="size-3.5 text-cobalt" />
                  Priority
                </span>
                <Select value={task.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="h-8 text-xs bg-card">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <User className="size-3.5 text-cobalt" />
                  Assignee
                </span>
                <p className="text-foreground font-medium py-1.5">
                  {task.assignee?.name || task.assignee?.email || "Unassigned"}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-cobalt" />
                  Due Date
                </span>
                <p className="text-foreground font-medium py-1.5">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Description
              </label>
              <Textarea
                value={editingDesc}
                onChange={(e) => setEditingDesc(e.target.value)}
                onBlur={handleDescBlur}
                placeholder="Add more context, acceptance criteria, or markdown notes..."
                className="text-xs min-h-[100px] resize-y bg-card"
              />
            </div>

            {/* Comments Thread */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-cobalt" />
                Comments Thread ({task.comments?.length || 0})
              </h4>

              {/* Comments list */}
              <div className="space-y-3">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment: any) => (
                    <div
                      key={comment.id}
                      className="p-3.5 rounded-lg border border-border bg-card space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">
                          {comment.author?.name || comment.author?.email || "Team member"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-2 italic">
                    No comments yet. Start the conversation below.
                  </p>
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="text-xs h-9 bg-card"
                  disabled={commentSubmitting}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={commentSubmitting || !commentText.trim()}
                  className="bg-cobalt hover:bg-cobalt/90 text-white shrink-0"
                >
                  <Send className="size-3.5" />
                </Button>
              </form>
            </div>

            {/* Task Activity Log */}
            {task.activityLogs && task.activityLogs.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity className="size-3.5" />
                  Task Audit History
                </h4>
                <div className="space-y-1.5">
                  {task.activityLogs.map((log: any) => (
                    <div key={log.id} className="text-[11px] text-muted-foreground flex items-center justify-between py-1">
                      <span>{log.action}: {log.details || "Updated"}</span>
                      <span className="text-[10px] text-muted-foreground/70">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground">
            Task not found
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
