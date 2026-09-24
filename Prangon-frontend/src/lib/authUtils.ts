export type UserRole = "SUPER_ADMIN" | "USER" | "OWNER" | "MEMBER";

export const authRoutes = [ "/login", "/register", "/forgot-password", "/reset-password", "/verify-email" ];

export const isAuthRoute = (pathname : string) => {
    return authRoutes.some((router : string) => router === pathname);
}

export type RouteConfig = {
    exact : string[],
    pattern : RegExp[]
}

export const commonProtectedRoutes : RouteConfig = {
    exact : ["/my-profile", "/change-password"],
    pattern : []
}

export const userProtectedRoutes : RouteConfig = {
    pattern: [/^\/dashboard/, /^\/workspaces/, /^\/w/, /^\/onboarding/], 
    exact : []
};

export const isRouteMatches = (pathname : string, routes : RouteConfig) => {
    if(routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern : RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname : string) : "SUPER_ADMIN" | "USER" | "COMMON" | null => {
    
    if(isRouteMatches(pathname, userProtectedRoutes)) {
        return "USER";
    }

    if(isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null; // public route
}

export const getDefaultDashboardRoute = (role : UserRole) => {
    if (role === "SUPER_ADMIN" || role === "USER" || role === "OWNER" || role === "MEMBER") {
        return "/dashboard";
    }

    return "/";
}

export const isValidRedirectForRole = (redirectPath : string, role : UserRole) => {
    const sanitizedRedirectPath = redirectPath.split("?")[0] || redirectPath;
    const routeOwner = getRouteOwner(sanitizedRedirectPath);

    if(routeOwner === null || routeOwner === "COMMON"){
        return true;
    }

    if(routeOwner === role || (routeOwner === "USER" && (role === "OWNER" || role === "MEMBER" || role === "USER"))){
        return true;
    }

    return false;
}