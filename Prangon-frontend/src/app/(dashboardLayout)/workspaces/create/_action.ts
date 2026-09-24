/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { ICreateWorkspacePayload, createWorkspaceZodSchema } from "@/zod/workspace.validation";
import { redirect } from "next/navigation";

export const createWorkspaceAction = async (payload : ICreateWorkspacePayload) : Promise<{success: boolean, message: string, data?: any} | ApiErrorResponse> =>{
    const parsedPayload = createWorkspaceZodSchema.safeParse(payload);

    if(!parsedPayload.success){
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }
    try {
        const response = await httpClient.post("/workspaces", parsedPayload.data);
        // It will redirect on frontend once it's success to avoid redirect throwing error in try block but for now let's just return success
        return { success: true, message: "Workspace created successfully", data: response.data };
    } catch (error : any) {
        console.log(error, "error");
        
        return {
            success: false,
            message: `Workspace creation failed: ${error?.response?.data?.message || error.message}`,
        }
    }
}
