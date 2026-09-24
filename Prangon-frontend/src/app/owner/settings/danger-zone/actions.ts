"use server";
import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function exportWorkspaceAction() {
  try {
    const res = await httpClient.get<any>(`/workspaces/${await getCurrentWorkspaceSlug()}/export`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to export workspace data",
    };
  }
}

export async function deleteWorkspaceAction() {
  try {
    await httpClient.delete(`/workspaces/${await getCurrentWorkspaceSlug()}`);
    revalidatePath("/");
    return { success: true, message: "Workspace permanently deleted." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to delete workspace",
    };
  }
}

export async function transferWorkspaceOwnershipAction( newOwnerId: string) {
  try {
    const res = await httpClient.post<any>(`/workspaces/${await getCurrentWorkspaceSlug()}/transfer-ownership`, {
      newOwnerId,
    });
    revalidatePath(`/owner`);
    return { success: true, data: res.data, message: "Workspace ownership transferred successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to transfer workspace ownership",
    };
  }
}

