"use server";

import { httpClient } from "@/lib/axios/httpClient";

export async function acceptInvitationAction(token: string) {
  try {
    const res = await httpClient.post("/invitations/accept", { token });
    return { success: true, message: "Invitation accepted successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to accept invitation",
    };
  }
}
