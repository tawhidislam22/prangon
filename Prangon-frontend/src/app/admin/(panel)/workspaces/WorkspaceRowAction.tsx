"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateWorkspaceStatusAction } from "../actions";
import { toast } from "sonner";
import { Ban, CheckCircle2 } from "lucide-react";

interface WorkspaceRowActionProps {
  workspaceId: string;
  currentStatus: string;
}

export function WorkspaceRowAction({
  workspaceId,
  currentStatus,
}: WorkspaceRowActionProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newStatus = currentStatus === "COMPLETED" ? "PENDING_WORKSPACE" : "COMPLETED";
    const res = await updateWorkspaceStatusAction(workspaceId, newStatus);
    if (res.success) {
      toast.success(`Workspace status updated to ${newStatus}`);
    } else {
      toast.error(res.message || "Failed to update status");
    }
    setLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={loading}
      onClick={handleToggle}
      className={`h-7 px-2 text-xs gap-1 ${
        currentStatus === "COMPLETED"
          ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
          : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
      }`}
    >
      {currentStatus === "COMPLETED" ? (
        <>
          <Ban className="size-3" />
          <span>Suspend</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="size-3" />
          <span>Activate</span>
        </>
      )}
    </Button>
  );
}
