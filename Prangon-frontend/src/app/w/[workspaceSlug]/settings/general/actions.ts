"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function updateWorkspaceAction(workspaceSlug: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const logoUrl = formData.get("logoUrl") as string;
  
  const payload: { name: string; slug?: string; logoUrl?: string } = { name };
  if (slug && slug.trim() !== workspaceSlug) {
    payload.slug = slug.trim().toLowerCase();
  }
  if (logoUrl) {
    payload.logoUrl = logoUrl;
  }
  
  try {
    const res = await httpClient.patch<any>(`/workspaces/${workspaceSlug}`, payload);
    const updated = res.data;
    
    revalidatePath(`/w/${workspaceSlug}/settings/general`);
    if (updated?.slug && updated.slug !== workspaceSlug) {
      revalidatePath(`/w/${updated.slug}/settings/general`);
    }
    return { success: true, message: "Workspace updated successfully.", data: updated };
  } catch (error: any) {
    return { 
      success: false, 
      message: error?.response?.data?.message || error.message || "Failed to update workspace"
    };
  }
}
