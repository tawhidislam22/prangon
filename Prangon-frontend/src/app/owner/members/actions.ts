"use server";
import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function inviteMemberAction( formData: FormData) {
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  try {
    await httpClient.post("/invitations", {
      workspaceSlug: await getCurrentWorkspaceSlug(),
      email,
      role,
    });
    
    revalidatePath(`/owner/members`);
    revalidatePath(`/owner/members/invitations`);
    return { success: true, message: "Invitation sent successfully." };
  } catch (error: any) {
    return { 
      success: false, 
      message: error?.response?.data?.message || error.message || "Failed to send invitation"
    };
  }
}

export async function updateMemberRoleAction(
  memberId: string,
  role: "ADMIN" | "MEMBER"
) {
  try {
    await httpClient.patch(`/workspace-members/${memberId}/role`, { role });
    revalidatePath(`/owner/members`);
    return { success: true, message: "Member role updated successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to update role",
    };
  }
}

export async function removeMemberAction( memberId: string) {
  try {
    await httpClient.delete(`/workspace-members/${memberId}`);
    revalidatePath(`/owner/members`);
    return { success: true, message: "Member removed from workspace." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to remove member",
    };
  }
}

export async function resendInvitationAction( invitationId: string) {
  try {
    await httpClient.post(`/invitations/${invitationId}/resend`, {});
    revalidatePath(`/owner/members/invitations`);
    return { success: true, message: "Invitation resent successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to resend invitation",
    };
  }
}

export async function revokeInvitationAction( invitationId: string) {
  try {
    await httpClient.delete(`/invitations/${invitationId}`);
    revalidatePath(`/owner/members/invitations`);
    return { success: true, message: "Invitation revoked." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to revoke invitation",
    };
  }
}
