"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { redirect } from "next/navigation";

export async function createPortalSessionAction(workspaceSlug: string) {
  let portalUrl = "";
  try {
    const res = await httpClient.post<any>("/payments/portal", {
      workspaceSlug,
    });
    if (res.success && res.data?.url) {
      portalUrl = res.data.url;
    }
  } catch (error) {
    console.error("Failed to create portal session", error);
    return { success: false, message: "Failed to connect to billing provider." };
  }

  if (portalUrl) {
    redirect(portalUrl);
  }
}
