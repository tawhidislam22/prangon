"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function exportWorkspaceAction(workspaceSlug: string) {
  try {
    const res = await httpClient.get<any>(`/workspaces/${workspaceSlug}/export`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to export workspace data",
    };
  }
}

export async function deleteWorkspaceAction(workspaceSlug: string) {
  try {
    await httpClient.delete(`/workspaces/${workspaceSlug}`);
    revalidatePath("/");
    return { success: true, message: "Workspace permanently deleted." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to delete workspace",
    };
  }
}

export async function transferWorkspaceOwnershipAction(workspaceSlug: string, newOwnerId: string) {
  try {
    const res = await httpClient.post<any>(`/workspaces/${workspaceSlug}/transfer-ownership`, {
      newOwnerId,
    });
    revalidatePath(`/w/${workspaceSlug}`);
    return { success: true, data: res.data, message: "Workspace ownership transferred successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to transfer workspace ownership",
    };
  }
}

