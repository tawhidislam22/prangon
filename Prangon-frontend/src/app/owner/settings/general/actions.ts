"use server";
import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function updateWorkspaceAction( formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const logoUrl = formData.get("logoUrl") as string;
  
  const currentSlug = await getCurrentWorkspaceSlug();
  const payload: { name: string; slug?: string; logoUrl?: string } = { name };
  if (slug && slug.trim() !== currentSlug) {
    payload.slug = slug.trim().toLowerCase();
  }
  if (logoUrl) {
    payload.logoUrl = logoUrl;
  }
  
  try {
    const res = await httpClient.patch<any>(`/workspaces/${currentSlug}`, payload);
    const updated = res.data;
    
    revalidatePath(`/owner/settings/general`);
    if (updated?.slug && updated.slug !== currentSlug) {
      revalidatePath(`/owner/settings/general`);
    }
    return { success: true, message: "Workspace updated successfully.", data: updated };
  } catch (error: any) {
    return { 
      success: false, 
      message: error?.response?.data?.message || error.message || "Failed to update workspace"
    };
  }
}
