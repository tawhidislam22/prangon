import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { getNewTokensWithRefreshToken, getUserInfo } from "./services/auth.services";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("localhost", "127.0.0.1");

async function refreshTokensInProxy(refreshToken: string) {
    try {
        if (!BASE_API_URL) return null;
        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}`
            }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.data as { accessToken: string; refreshToken: string; sessionToken?: string } | undefined;
    } catch {
        return null;
    }
}

export async function proxy(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;
        const pathWithQuery = `${pathname}${request.nextUrl.search}`;
        const accessToken = request.cookies.get("accessToken")?.value;
        const refreshToken = request.cookies.get("refreshToken")?.value;

        let currentAccessToken = accessToken;
        let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).data : null;
        let isValidAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).success : false;

        const refreshedCookies: { name: string; value: string; options: any }[] = [];

        // proactively refresh token if expiring soon and set new cookies on response
        if (isValidAccessToken && refreshToken && (await isTokenExpiringSoon(accessToken!))) {
            const refreshed = await refreshTokensInProxy(refreshToken);
            if (refreshed?.accessToken) {
                currentAccessToken = refreshed.accessToken;
                const newDecoded = jwtUtils.verifyToken(refreshed.accessToken, process.env.JWT_ACCESS_SECRET as string);
                if (newDecoded.success && newDecoded.data) {
                    decodedAccessToken = newDecoded.data;
                    isValidAccessToken = true;
                }
                refreshedCookies.push(
                    {
                        name: "accessToken",
                        value: refreshed.accessToken,
                        options: { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 }
                    },
                    {
                        name: "refreshToken",
                        value: refreshed.refreshToken,
                        options: { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 }
                    }
                );
                if (refreshed.sessionToken) {
                    refreshedCookies.push({
                        name: "better-auth.session_token",
                        value: refreshed.sessionToken,
                        options: { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 }
                    });
                }
            }
        }

        const attachCookies = <T extends NextResponse>(res: T): T => {
            for (const c of refreshedCookies) {
                res.cookies.set(c.name, c.value, c.options);
            }
            return res;
        };

        let userRole: UserRole | null = null;
        if (decodedAccessToken) {
            userRole = (decodedAccessToken as any).role as UserRole;
        }

        const routerOwner = getRouteOwner(pathname);
        const isAuth = isAuthRoute(pathname);

        // Rule - 1 : Logged-in users should not access auth pages
        if (isAuth && isValidAccessToken && pathname !== "/verify-email" && pathname !== "/reset-password") {
            return attachCookies(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)));
        }

        // Rule - 2 : User is trying to access reset password page
        if (pathname === "/reset-password") {
            const email = request.nextUrl.searchParams.get("email");
            if (currentAccessToken && email) {
                const needPasswordChange = (decodedAccessToken as any)?.needPasswordChange;
                if (needPasswordChange) {
                    return attachCookies(NextResponse.next());
                } else {
                    return attachCookies(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)));
                }
            }
            if (email) {
                return attachCookies(NextResponse.next());
            }
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathWithQuery);
            return attachCookies(NextResponse.redirect(loginUrl));
        }

        // Rule-3 User trying to access Public route
        if (routerOwner === null) {
            return attachCookies(NextResponse.next());
        }

        // Rule - 4 User is Not logged in but trying to access protected route
        if (!currentAccessToken || !isValidAccessToken) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathWithQuery);
            return attachCookies(NextResponse.redirect(loginUrl));
        }

        // Rule - Enforcing verify email / reset password directly from verified token claims
        if (decodedAccessToken) {
            const email = (decodedAccessToken as any).email;
            const emailVerified = (decodedAccessToken as any).emailVerified;
            const needPasswordChange = (decodedAccessToken as any).needPasswordChange;

            if (emailVerified === false) {
                if (pathname !== "/verify-email") {
                    const verifyEmailUrl = new URL("/verify-email", request.url);
                    if (email) verifyEmailUrl.searchParams.set("email", email);
                    return attachCookies(NextResponse.redirect(verifyEmailUrl));
                }
                return attachCookies(NextResponse.next());
            }
            if (emailVerified === true && pathname === "/verify-email") {
                return attachCookies(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)));
            }

            if (needPasswordChange === true) {
                if (pathname !== "/reset-password") {
                    const resetPasswordUrl = new URL("/reset-password", request.url);
                    if (email) resetPasswordUrl.searchParams.set("email", email);
                    return attachCookies(NextResponse.redirect(resetPasswordUrl));
                }
                return attachCookies(NextResponse.next());
            }
            if (needPasswordChange === false && pathname === "/reset-password") {
                return attachCookies(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)));
            }
        }

        // Rule - 5 User trying to access Common protected route
        if (routerOwner === "COMMON") {
            return attachCookies(NextResponse.next());
        }

        // Rule-6 User trying to visit role based protected but doesn't have required role
        if (routerOwner === "SUPER_ADMIN" || routerOwner === "USER") {
            const isAuthorizedUser = routerOwner === "USER" && (userRole === "USER" || userRole === "OWNER" || userRole === "MEMBER");
            if (routerOwner !== userRole && !isAuthorizedUser) {
                return attachCookies(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)));
            }
        }

        return attachCookies(NextResponse.next());

    } catch (error) {
        console.error("Error in proxy middleware:", error);
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ]
}