"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateUserStatusAction } from "../actions";
import { toast } from "sonner";
import { UserX, UserCheck } from "lucide-react";

interface UserRowActionProps {
  userId: string;
  currentStatus: string;
}

export function UserRowAction({ userId, currentStatus }: UserRowActionProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const res = await updateUserStatusAction(userId, newStatus);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message || "Failed to update user status");
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
        currentStatus === "ACTIVE"
          ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
          : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
      }`}
    >
      {currentStatus === "ACTIVE" ? (
        <>
          <UserX className="size-3" />
          <span>Block</span>
        </>
      ) : (
        <>
          <UserCheck className="size-3" />
          <span>Unblock</span>
        </>
      )}
    </Button>
  );
}
