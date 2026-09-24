"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("localhost", "127.0.0.1");

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getWorkspaces() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        if (!accessToken) {
            return [];
        }

        const res = await fetch(`${BASE_API_URL}/workspaces`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`
            },
            cache: 'no-store',
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
            return [];
        }

        const { data } = await res.json();
        return data || [];
    } catch {
        return [];
    }
}

export async function createWorkspace(payload: { name: string, description?: string }) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value;

        if (!accessToken) {
            return { success: false, message: "Unauthorized" };
        }

        const res = await fetch(`${BASE_API_URL}/workspaces`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const error = await res.json();
            return { success: false, message: error.message || "Failed to create workspace" };
        }

        const { data } = await res.json();
        return { success: true, data };
    } catch (error: any) {
        console.error("Error creating workspace:", error);
        return { success: false, message: error.message || "Internal Server Error" };
    }
}
