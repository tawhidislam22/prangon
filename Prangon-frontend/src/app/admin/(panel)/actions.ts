/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

export async function getPlatformStatsAction() {
  try {
    const res = await httpClient.get<any>("/platform-admin/stats");
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to load platform stats",
      data: null,
    };
  }
}

export async function getAllWorkspacesAction() {
  try {
    const res = await httpClient.get<any[]>("/platform-admin/workspaces");
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to load workspaces",
      data: [],
    };
  }
}

export async function updateWorkspaceStatusAction(
  workspaceId: string,
  onboardingStatus: string
) {
  try {
    const res = await httpClient.patch(`/platform-admin/workspaces/${workspaceId}/status`, {
      onboardingStatus,
    });
    revalidatePath("/admin/workspaces");
    return { success: true, message: "Workspace status updated." };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update workspace status",
    };
  }
}

export async function getAllUsersAction() {
  try {
    const res = await httpClient.get<any[]>("/platform-admin/users");
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to load users",
      data: [],
    };
  }
}

export async function updateUserStatusAction(userId: string, status: string) {
  try {
    await httpClient.patch(`/platform-admin/users/${userId}/status`, { status });
    revalidatePath("/admin/users");
    return { success: true, message: `User status changed to ${status}.` };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update user status",
    };
  }
}

export async function getAllSubscriptionsAction() {
  try {
    const res = await httpClient.get<any[]>("/platform-admin/subscriptions");
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to load subscriptions",
      data: [],
    };
  }
}

export async function getAuditLogsAction() {
  try {
    const res = await httpClient.get<any[]>("/platform-admin/audit-logs");
    return { success: true, data: res.data || [] };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to load audit logs",
      data: [],
    };
  }
}

export async function getEmailDiagnosticsAction() {
  try {
    const res = await httpClient.get<any>("/platform-admin/emails/diagnostics");
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to load email diagnostics",
      data: null,
    };
  }
}

export async function previewEmailTemplateAction(templateId: string) {
  try {
    const res = await httpClient.get<any>(`/platform-admin/emails/preview/${templateId}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to render email preview",
      data: null,
    };
  }
}

export async function sendTestEmailAction(
  toEmail: string,
  templateId = "test",
  customSubject?: string
) {
  try {
    const res = await httpClient.post<any>("/platform-admin/emails/send-test", {
      toEmail,
      templateId,
      customSubject,
    });
    return { success: true, message: "Email sent successfully!", data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to send test email",
    };
  }
}
