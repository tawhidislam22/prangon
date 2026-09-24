"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldCheck, UserCheck, Trash2 } from "lucide-react";
import { updateMemberRoleAction, removeMemberAction } from "./actions";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";

interface MemberRowActionsProps {
  
  workspaceSlug?: string;
  memberId: string;
  memberName: string;
  currentRole: string;
  isCurrentUser: boolean;
  currentUserRole: string;
}

export function MemberRowActions({
  workspaceSlug,
  memberId,
  memberName,
  currentRole,
  isCurrentUser,
  currentUserRole,
}: MemberRowActionsProps) {
  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // If current role is MEMBER, they can't manage other members
  if (currentUserRole === "MEMBER") return null;
  // Can't edit yourself
  if (isCurrentUser) return null;
  // If target is OWNER, no one can demote them
  if (currentRole === "OWNER") return null;

  const handleRoleChange = async (newRole: "ADMIN" | "MEMBER") => {
    setLoading(true);
    await updateMemberRoleAction( memberId, newRole);
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    await removeMemberAction( memberId);
    setLoading(false);
    setConfirmDeleteOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={loading}
            className="size-8 text-graphite hover:text-ink hover:bg-muted"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Manage Member
          </DropdownMenuLabel>
          {currentUserRole === "OWNER" && currentRole !== "ADMIN" && (
            <DropdownMenuItem
              onClick={() => handleRoleChange("ADMIN")}
              className="gap-2 text-xs cursor-pointer"
            >
              <ShieldCheck className="size-3.5 text-cobalt" />
              <span>Promote to Admin</span>
            </DropdownMenuItem>
          )}
          {currentUserRole === "OWNER" && currentRole !== "MEMBER" && (
            <DropdownMenuItem
              onClick={() => handleRoleChange("MEMBER")}
              className="gap-2 text-xs cursor-pointer"
            >
              <UserCheck className="size-3.5 text-graphite" />
              <span>Change to Member</span>
            </DropdownMenuItem>
          )}
          {currentUserRole === "OWNER" && <DropdownMenuSeparator />}
          <DropdownMenuItem
            onClick={() => setConfirmDeleteOpen(true)}
            className="gap-2 text-xs text-red-600 focus:text-red-600 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>Remove from workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title={`Remove ${memberName}?`}
        description={`This will immediately revoke ${memberName}'s access to this workspace and all its projects.`}
        confirmText="Remove Member"
        variant="destructive"
        onConfirm={handleRemove}
      />
    </>
  );
}
