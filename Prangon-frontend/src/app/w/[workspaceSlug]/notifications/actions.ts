"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function markNotificationAsReadAction(workspaceSlug: string, notificationId: string) {
  try {
    await httpClient.patch(`/notifications/${notificationId}/read`, {});
    revalidatePath(`/w/${workspaceSlug}/notifications`);
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read", error);
    return { success: false };
  }
}

export async function markAllNotificationsAsReadAction(workspaceSlug: string) {
  try {
    await httpClient.patch(`/notifications/read-all`, { workspaceSlug });
    revalidatePath(`/w/${workspaceSlug}/notifications`);
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all as read", error);
    return { success: false };
  }
}
