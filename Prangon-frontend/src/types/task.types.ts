export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BACKLOG" | "IN_REVIEW";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ITask {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string | null;
  assignee?: { id: string; name?: string; email?: string; image?: string | null } | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
