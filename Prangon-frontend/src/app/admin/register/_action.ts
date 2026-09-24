/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface IAdminRequestPayload {
  name: string;
  email: string;
  password: string;
  reason?: string;
}

export const submitAdminRequestAction = async (payload: IAdminRequestPayload) => {
  if (!payload.name || !payload.email || !payload.password) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  if (payload.password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters long.",
    };
  }

  try {
    const response = await httpClient.post<{ message?: string }>("/admin-requests", payload);
    return {
      success: true,
      message: response.data?.message || "Admin request submitted successfully.",
    };
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to submit admin request.";
    return {
      success: false,
      message: errMsg,
    };
  }
};