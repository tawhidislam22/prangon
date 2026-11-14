"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inviteMemberAction } from "./actions";
import { toast } from "sonner";
import { Loader2, UserPlus, Check, Copy, Mail } from "lucide-react";

interface InviteMemberDialogProps {
  workspaceSlug?: string;
}

export function InviteMemberDialog({ workspaceSlug }: InviteMemberDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("MEMBER");
  const [invitedLink, setInvitedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await inviteMemberAction(formData);

    if (result.success) {
      toast.success(result.message);
      if (result.token && result.workspaceSlug) {
        const link = `${window.location.origin}/accept-invitation?token=${result.token}&workspace=${result.workspaceSlug}`;
        setInvitedLink(link);
      } else {
        setIsOpen(false);
      }
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (invitedLink) {
      navigator.clipboard.writeText(invitedLink);
      setCopied(true);
      toast.success("Invitation link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setInvitedLink(null);
      setCopied(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a new member</DialogTitle>
          <DialogDescription>
            Send an email invitation to join this workspace.
          </DialogDescription>
        </DialogHeader>

        {invitedLink ? (
          <div className="space-y-4 py-2">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Check className="size-4 shrink-0" />
              <span>Invitation created successfully! You can also share the link directly:</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={invitedLink}
                className="font-mono text-xs bg-muted"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="shrink-0 gap-1.5"
              >
                {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setInvitedLink(null);
                  setIsOpen(false);
                }}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {workspaceSlug && (
              <input type="hidden" name="workspaceSlug" value={workspaceSlug} />
            )}
            <input type="hidden" name="role" value={role} />

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="colleague@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-select">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role-select" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member (Standard collaborator)</SelectItem>
                  <SelectItem value="ADMIN">Admin (Manage members & projects)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Sending Invitation...</span>
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Send Invitation</span>
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
