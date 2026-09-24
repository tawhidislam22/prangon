"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function createProject(payload: {
  name: string;
  description?: string;
  workspaceId: string;
}) {
  try {
    const res = await httpClient.post<any>("/projects", payload);
    return { success: res.success, message: res.message, data: res.data };
  } catch (error: any) {
    console.error("Error creating project:", error);
    return { success: false, message: error.message || "Failed to create project" };
  }
}

export async function updateProject(
  projectId: string,
  payload: { name?: string; description?: string }
) {
  try {
    const res = await httpClient.patch<any>(`/projects/${projectId}`, payload);
    return { success: res.success, message: res.message, data: res.data };
  } catch (error: any) {
    console.error("Error updating project:", error);
    return { success: false, message: error.message || "Failed to update project" };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const res = await httpClient.delete<any>(`/projects/${projectId}`);
    return { success: res.success, message: res.message };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return { success: false, message: error.message || "Failed to delete project" };
  }
}
