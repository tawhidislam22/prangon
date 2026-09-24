"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function revokeSessionAction(workspaceSlug: string, sessionId: string) {
  try {
    await httpClient.delete(`/users/sessions/${sessionId}`);
    revalidatePath(`/w/${workspaceSlug}/settings/security`);
    return { success: true, message: "Session successfully revoked." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to revoke session",
    };
  }
}

export async function revokeAllOtherSessionsAction(workspaceSlug: string) {
  try {
    await httpClient.post(`/users/sessions/logout-all`, {});
    revalidatePath(`/w/${workspaceSlug}/settings/security`);
    return { success: true, message: "All other sessions revoked." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to revoke all other sessions",
    };
  }
}

export async function changePasswordAction(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  try {
    await httpClient.post(`/auth/change-password`, {
      currentPassword,
      newPassword,
    });
    return { success: true, message: "Password updated successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to change password",
    };
  }
}
