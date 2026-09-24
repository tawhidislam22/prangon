/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function inviteMemberAction(workspaceSlug: string, formData: FormData) {
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  try {
    await httpClient.post("/invitations", {
      workspaceSlug,
      email,
      role,
    });
    
    revalidatePath(`/w/${workspaceSlug}/members`);
    revalidatePath(`/w/${workspaceSlug}/members/invitations`);
    return { success: true, message: "Invitation sent successfully." };
  } catch (error: any) {
    return { 
      success: false, 
      message: error?.response?.data?.message || error.message || "Failed to send invitation"
    };
  }
}

export async function updateMemberRoleAction(
  workspaceSlug: string,
  memberId: string,
  role: "ADMIN" | "MEMBER"
) {
  try {
    await httpClient.patch(`/workspace-members/${memberId}/role`, { role });
    revalidatePath(`/w/${workspaceSlug}/members`);
    return { success: true, message: "Member role updated successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to update role",
    };
  }
}

export async function removeMemberAction(workspaceSlug: string, memberId: string) {
  try {
    await httpClient.delete(`/workspace-members/${memberId}`);
    revalidatePath(`/w/${workspaceSlug}/members`);
    return { success: true, message: "Member removed from workspace." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to remove member",
    };
  }
}

export async function resendInvitationAction(workspaceSlug: string, invitationId: string) {
  try {
    await httpClient.post(`/invitations/${invitationId}/resend`, {});
    revalidatePath(`/w/${workspaceSlug}/members/invitations`);
    return { success: true, message: "Invitation resent successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to resend invitation",
    };
  }
}

export async function revokeInvitationAction(workspaceSlug: string, invitationId: string) {
  try {
    await httpClient.delete(`/invitations/${invitationId}`);
    revalidatePath(`/w/${workspaceSlug}/members/invitations`);
    return { success: true, message: "Invitation revoked." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to revoke invitation",
    };
  }
}
