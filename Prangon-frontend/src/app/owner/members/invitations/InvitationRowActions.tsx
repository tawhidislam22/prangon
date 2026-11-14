"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, XCircle, Copy, Check } from "lucide-react";
import { resendInvitationAction, revokeInvitationAction } from "../actions";
import { toast } from "sonner";

interface InvitationRowActionsProps {
  workspaceSlug?: string;
  invitationId: string;
  token?: string;
}

export function InvitationRowActions({
  workspaceSlug,
  invitationId,
  token,
}: InvitationRowActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!token) return;
    const url = `${window.location.origin}/accept-invitation?token=${token}${
      workspaceSlug ? `&workspace=${workspaceSlug}` : ""
    }`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Invitation link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResend = async () => {
    setLoading("resend");
    const res = await resendInvitationAction(invitationId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setLoading(null);
  };

  const handleRevoke = async () => {
    setLoading("revoke");
    const res = await revokeInvitationAction(invitationId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setLoading(null);
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {token && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="h-7 px-2 text-xs gap-1 border-border shadow-2xs"
          title="Copy invitation link"
        >
          {copied ? (
            <Check className="size-3 text-emerald-600" />
          ) : (
            <Copy className="size-3" />
          )}
          <span>{copied ? "Copied" : "Copy Link"}</span>
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={loading !== null}
        onClick={handleResend}
        className="h-7 px-2 text-xs gap-1 border-border shadow-2xs"
      >
        <RefreshCw className={`size-3 ${loading === "resend" ? "animate-spin" : ""}`} />
        <span>Resend</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={loading !== null}
        onClick={handleRevoke}
        className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
      >
        <XCircle className="size-3" />
        <span>Revoke</span>
      </Button>
    </div>
  );
}
