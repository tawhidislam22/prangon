"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  const name = formData.get("name") as string;
  const image = formData.get("image") as string;

  const payload: { name?: string; image?: string } = {};
  if (name) payload.name = name;
  if (image) payload.image = image;

  try {
    const res = await httpClient.patch<any>("/users/me", payload);
    revalidatePath("/");
    return { success: true, message: "Profile updated successfully.", data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to update profile",
    };
  }
}

export async function logoutAllSessionsAction() {
  try {
    await httpClient.post("/users/sessions/logout-all", {});
    return { success: true, message: "Logged out from all sessions." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to log out sessions",
    };
  }
}
