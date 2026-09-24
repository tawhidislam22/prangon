/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export const getAdminRequestsAction = async () => {
  try {
    const res = await httpClient.get<{ data: any[] }>("/admin-requests");
    return {
      success: true,
      data: res.data?.data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to load requests",
      data: [],
    };
  }
};

export const acceptAdminRequestAction = async (id: string) => {
  try {
    const res = await httpClient.patch<{ message?: string }>(`/admin-requests/${id}/accept`, {});
    revalidatePath("/admin/requests");
    return {
      success: true,
      message: res.data?.message || "Request accepted and admin account created.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to accept request",
    };
  }
};

export const deleteAdminRequestAction = async (id: string) => {
  try {
    const res = await httpClient.delete<{ message?: string }>(`/admin-requests/${id}`);
    revalidatePath("/admin/requests");
    return {
      success: true,
      message: res.data?.message || "Request deleted successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to delete request",
    };
  }
};