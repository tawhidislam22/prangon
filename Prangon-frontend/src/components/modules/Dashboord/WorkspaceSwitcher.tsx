"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getWorkspaces } from "@/services/workspace.services";
import { useRouter } from "next/navigation";

export default function WorkspaceSwitcher() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchWorkspaces() {
      const data = await getWorkspaces();
      if (data && data.length > 0) {
        setWorkspaces(data);
        setActiveWorkspace(data[0].id);
      }
    }
    fetchWorkspaces();
  }, []);

  const handleValueChange = (val: string) => {
    setActiveWorkspace(val);
    // Future logic: Set active workspace cookie or context
    // router.push(`/dashboard?workspaceId=${val}`);
  };

  return (
    <div className="px-4 py-2">
      <Select value={activeWorkspace} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full bg-slate-50 border-slate-200 shadow-none">
          <SelectValue placeholder="Select Workspace" />
        </SelectTrigger>
        <SelectContent>
          {workspaces.length === 0 ? (
            <SelectItem value="none" disabled>
              No Workspaces
            </SelectItem>
          ) : (
            workspaces.map((workspace) => (
              <SelectItem key={workspace.id} value={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
