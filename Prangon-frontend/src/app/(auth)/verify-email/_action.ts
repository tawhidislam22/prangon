/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { IVerifyEmailPayload, verifyEmailZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const verifyEmailAction = async (
    payload: IVerifyEmailPayload,
    redirectPath?: string
): Promise<{ success: boolean; message: string } | ApiErrorResponse> => {
    const normalizedData = {
        email: payload.email?.trim().toLowerCase(),
        otp: payload.otp?.trim(),
    };
    const parsedPayload = verifyEmailZodSchema.safeParse(normalizedData);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0]?.message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }

    try {
        const response = await httpClient.post<ILoginResponse>("/auth/verify-email", parsedPayload.data);

        if (response?.data) {
            const { accessToken, refreshToken, token, user } = response.data;
            if (accessToken) await setTokenInCookies("accessToken", accessToken);
            if (refreshToken) await setTokenInCookies("refreshToken", refreshToken);
            if (token) await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

            const role = user?.role as UserRole;
            const fallbackPath = role === "OWNER" ? "/onboarding/company" : getDefaultDashboardRoute(role || "USER");
            const targetPath = redirectPath && isValidRedirectForRole(redirectPath, role)
                ? redirectPath
                : fallbackPath;

            redirect(targetPath);
        }

        return {
            success: true,
            message: response?.message || "Email verified successfully",
        };
    } catch (error: any) {
        if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
            throw error;
        }

        const errMsg = error?.response?.data?.message || error?.message || "Email verification failed";
        return {
            success: false,
            message: errMsg,
        };
    }
};

export const resendOtpAction = async (
    email: string
): Promise<{ success: boolean; message: string }> => {
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
        return {
            success: false,
            message: "Valid email address is required",
        };
    }

    try {
        const response = await httpClient.post("/auth/resend-verification-otp", { email: normalizedEmail });
        return {
            success: true,
            message: response?.message || "Verification code sent to your email",
        };
    } catch (error: any) {
        const errMsg = error?.response?.data?.message || error?.message || "Failed to resend verification code";
        return {
            success: false,
            message: errMsg,
        };
    }
};

