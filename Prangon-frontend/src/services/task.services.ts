"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function createTask(payload: {
  title: string;
  description?: string;
  projectId: string;
  status?: string;
  priority?: string;
}) {
  try {
    const res = await httpClient.post<any>("/tasks", payload);
    return { success: res.success, message: res.message, data: res.data };
  } catch (error: any) {
    console.error("Error creating task:", error);
    return { success: false, message: error.message || "Failed to create task" };
  }
}

export async function getTaskById(taskId: string) {
  try {
    const res = await httpClient.get<any>(`/tasks/${taskId}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("Error fetching task:", error);
    return { success: false, message: error.message || "Failed to fetch task" };
  }
}

export async function updateTask(
  taskId: string,
  payload: {
    status?: string;
    priority?: string;
    title?: string;
    description?: string;
  }
) {
  try {
    const res = await httpClient.patch<any>(`/tasks/${taskId}`, payload);
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("Error updating task:", error);
    return { success: false, message: error.message || "Failed to update task" };
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  return updateTask(taskId, { status });
}

export async function addTaskComment(taskId: string, content: string) {
  try {
    const res = await httpClient.post<any>(`/tasks/${taskId}/comments`, { content });
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("Error adding task comment:", error);
    return { success: false, message: error.message || "Failed to add comment" };
  }
}

export async function deleteTask(taskId: string) {
  try {
    await httpClient.delete(`/tasks/${taskId}`);
    return { success: true, message: "Task deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return { success: false, message: error.message || "Failed to delete task" };
  }
}
