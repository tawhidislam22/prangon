"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, XCircle } from "lucide-react";
import { resendInvitationAction, revokeInvitationAction } from "../actions";

interface InvitationRowActionsProps {
  workspaceSlug: string;
  invitationId: string;
}

export function InvitationRowActions({
  workspaceSlug,
  invitationId,
}: InvitationRowActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleResend = async () => {
    setLoading("resend");
    await resendInvitationAction(workspaceSlug, invitationId);
    setLoading(null);
  };

  const handleRevoke = async () => {
    setLoading("revoke");
    await revokeInvitationAction(workspaceSlug, invitationId);
    setLoading(null);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={loading !== null}
        onClick={handleResend}
        className="h-7 px-2 text-xs gap-1 border-line"
      >
        <RefreshCw className={`size-3 ${loading === "resend" ? "animate-spin" : ""}`} />
        <span>Resend</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={loading !== null}
        onClick={handleRevoke}
        className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
      >
        <XCircle className="size-3" />
        <span>Revoke</span>
      </Button>
    </div>
  );
}
