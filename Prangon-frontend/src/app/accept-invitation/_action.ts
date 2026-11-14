"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getUserInfo, logoutUser } from "@/services/auth.services";

export async function getCurrentUserAction() {
  try {
    return await getUserInfo();
  } catch {
    return null;
  }
}

export async function getInvitationDetailsAction(token: string) {
  try {
    const res = await httpClient.get<any>(`/invitations/details/${token}`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to load invitation details",
    };
  }
}

export async function acceptInvitationAction(token: string) {
  try {
    const res = await httpClient.post<any>("/invitations/accept", { token });
    const data = res.data;
    const workspaceSlug = data?.workspace?.slug || data?.workspaceMember?.workspace?.slug;
    const role = data?.workspaceMember?.role || "MEMBER";

    if (workspaceSlug) {
      const cookieStore = await cookies();
      cookieStore.set("activeWorkspaceSlug", workspaceSlug, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/owner/dashboard");
    revalidatePath("/workspaces");
    revalidatePath("/owner/members");

    return {
      success: true,
      message: data?.alreadyJoined
        ? "You have already joined this workspace. Redirecting..."
        : "Invitation accepted successfully!",
      workspaceSlug,
      role,
      alreadyJoined: Boolean(data?.alreadyJoined),
    };
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to accept invitation";
    const status = error?.response?.status;
    return {
      success: false,
      message,
      status,
    };
  }
}

export async function switchAccountLogoutAction() {
  try {
    await logoutUser();
  } catch {
    //
  }
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("better-auth.session_token");
}
