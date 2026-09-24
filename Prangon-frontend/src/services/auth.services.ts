"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { deleteCookie } from "@/lib/cookieUtils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("localhost", "127.0.0.1");

if(!BASE_API_URL){
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokensWithRefreshToken(refreshToken  : string) : Promise<boolean> {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Cookie : `refreshToken=${refreshToken}`
            }
        });

        if(!res.ok){
            return false;
        }

        const {data} = await res.json();

        const { accessToken, refreshToken: newRefreshToken, token } = data;

        if(accessToken){
            await setTokenInCookies("accessToken", accessToken);
        }

        if(newRefreshToken){
            await setTokenInCookies("refreshToken", newRefreshToken);
        }

        if(token){
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
        }

        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export const getUserInfo = cache(async () => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value

        if (!accessToken) {
            return null;
        }

        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: "GET",
            cache: "no-store",
            signal: AbortSignal.timeout(10000),
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`
            }
        });

        if (!res.ok) {
            return null;
        }

        const { data } = await res.json();

        return data;
    } catch {
        return null;
    }
});

export async function logoutUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    try {
        if (accessToken) {
            await fetch(`${BASE_API_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken || ""}`,
                },
            });
        }
    } finally {
        await Promise.all([
            deleteCookie("accessToken"),
            deleteCookie("refreshToken"),
            deleteCookie("better-auth.session_token"),
        ]);
    }

    redirect("/login");
}
