/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (payload : IRegisterPayload, redirectPath?: string) : Promise<{success: boolean, message: string} | ApiErrorResponse> =>{
    const parsedPayload = registerZodSchema.safeParse(payload);

    if(!parsedPayload.success){
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }
    try {
        const response = await httpClient.post<any>("/auth/register", parsedPayload.data);

        if (response?.data) {
            const { accessToken, refreshToken, token } = response.data;
            if (accessToken) await setTokenInCookies("accessToken", accessToken);
            if (refreshToken) await setTokenInCookies("refreshToken", refreshToken);
            if (token) await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
        }

        if (redirectPath) {
            redirect(redirectPath);
        } else if (parsedPayload.data.role === "OWNER") {
            redirect("/onboarding/company");
        } else {
            redirect("/dashboard");
        }
    } catch (error : any) {
        console.log(error, "error");
        if(error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")){
            throw error;
        }

        const errMsg = error?.response?.data?.message || error?.message || "Registration failed";
        return {
            success: false,
            message: `Registration failed: ${errMsg}`,
        }
    }
}
