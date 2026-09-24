import { cookies } from "next/headers";
import { httpClient } from "@/lib/axios/httpClient";
import { IWorkspace } from "@/types/workspace.types";

export async function getCurrentWorkspaceSlug(): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const activeSlug = cookieStore.get("activeWorkspaceSlug")?.value;
        if (activeSlug) return activeSlug;

        const res = await httpClient.get<IWorkspace[]>("/workspaces");
        if (res.data && res.data.length > 0) {
            return res.data[0].slug;
        }
    } catch {
        return null;
    }
    return null;
}
