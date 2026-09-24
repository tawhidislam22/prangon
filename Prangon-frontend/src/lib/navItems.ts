import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            items: [
                {
                    title: "Home",
                    href: "/",
                    icon: "Home"
                },
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard"
                },
                {
                    title: "My Profile",
                    href: `/my-profile`,
                    icon: "User",
                },
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "change-password",
                    icon: "Settings"
                }
            ]
        }
    ]
}

export const workspaceNavItems: NavSection[] = [
    {
        title: "Workspace",
        items: [
            {
                title: "Projects",
                href: "/dashboard/projects",
                icon: "Folder",
            },
            {
                title: "My Tasks",
                href: "/dashboard/tasks",
                icon: "CheckSquare",
            },
            {
                title: "Team Members",
                href: "/dashboard/team",
                icon: "Users",
            },
            {
                title: "Billing & Subscription",
                href: "/dashboard/billing",
                icon: "CreditCard",
            },
        ]
    }
]


export const getNavItemsByRole = (role: UserRole): NavSection[] => {
    const commonNavItems = getCommonNavItems(role);
    // Since this is a SaaS platform, everyone gets the workspace items, 
    // but we can further restrict specific sub-pages inside the component itself.
    return [...commonNavItems, ...workspaceNavItems];
}