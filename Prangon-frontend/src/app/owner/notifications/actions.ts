"use server";
import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function markNotificationAsReadAction( notificationId: string) {
  try {
    await httpClient.patch(`/notifications/${notificationId}/read`, {});
    revalidatePath(`/owner/notifications`);
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read", error);
    return { success: false };
  }
}

export async function markAllNotificationsAsReadAction() {
  try {
    await httpClient.patch(`/notifications/read-all`, { workspaceSlug: await getCurrentWorkspaceSlug() });
    revalidatePath(`/owner/notifications`);
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all as read", error);
    return { success: false };
  }
}
