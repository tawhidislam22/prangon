"use server";

import { cookies } from "next/headers";

export async function setActiveWorkspaceAction(slug: string) {
    const cookieStore = await cookies();
    cookieStore.set("activeWorkspaceSlug", slug, { path: "/", maxAge: 60 * 60 * 24 * 30 }); // 30 days
}
