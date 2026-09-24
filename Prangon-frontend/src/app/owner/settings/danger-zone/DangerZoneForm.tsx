"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { Download, AlertTriangle, Trash2, ArrowRightLeft, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  exportWorkspaceAction,
  deleteWorkspaceAction,
  transferWorkspaceOwnershipAction,
} from "./actions";

interface WorkspaceMemberItem {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

interface DangerZoneFormProps {
  
  workspaceSlug?: string;
  members?: WorkspaceMemberItem[];
  currentUserId?: string;
}

export function DangerZoneForm({
  workspaceSlug,
  members = [],
  currentUserId,
}: DangerZoneFormProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Eligible members for transfer (excluding current user)
  const eligibleMembers = members.filter(
    (m) => m.userId !== currentUserId && m.user?.id !== currentUserId && m.role !== "OWNER"
  );

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await exportWorkspaceAction();
      if (res.success && res.data) {
        const dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(res.data, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `${workspaceSlug}-export.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        toast.success("Workspace data exported successfully.");
      } else {
        toast.error(res.message || "Failed to export workspace data");
      }
    } catch {
      toast.error("Failed to export workspace data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedMemberId) {
      toast.error("Please select an eligible member to transfer ownership to.");
      return;
    }

    setIsTransferring(true);
    try {
      const res = await transferWorkspaceOwnershipAction( selectedMemberId);
      if (res.success) {
        toast.success(res.message);
        setTransferOpen(false);
        router.push(`/owner/dashboard`);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to transfer workspace ownership");
    } finally {
      setIsTransferring(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteWorkspaceAction();
      if (res.success) {
        toast.success("Workspace permanently deleted.");
        router.push("/dashboard");
      } else {
        toast.error(res.message || "Failed to delete workspace");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete workspace");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Data */}
      <Card className="border border-line bg-card shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Download className="size-4 text-cobalt" />
            Export Workspace Data
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Download a full JSON archive containing all projects, tasks, member lists, and activity logs.
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-5 pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="text-xs border-line gap-1.5"
          >
            <Download className="size-3.5" />
            <span>Export Archive (.json)</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Transfer Ownership */}
      <Card className="border border-amber-500/30 bg-amber-500/5 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <ArrowRightLeft className="size-4 text-amber-600" />
            Transfer Workspace Ownership
          </CardTitle>
          <CardDescription className="text-xs text-amber-700/80 dark:text-amber-400/80">
            Transfer full ownership of this workspace to another active team member. You will be demoted to an Admin.
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-5 pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTransferOpen(true)}
            className="text-xs border-amber-300 text-amber-800 hover:bg-amber-100/50 dark:border-amber-700 dark:text-amber-300 gap-1.5"
          >
            <ArrowRightLeft className="size-3.5" />
            <span>Transfer Ownership...</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Workspace */}
      <Card className="border border-red-200 bg-red-50/20 dark:border-red-900/40 dark:bg-red-950/10 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-600" />
            Delete Workspace
          </CardTitle>
          <CardDescription className="text-xs text-red-600/80 dark:text-red-400/80">
            Permanently delete this workspace and all associated projects, tasks, files, and billing history. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-5 pt-0">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="text-xs gap-1.5 bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="size-3.5" />
            <span>Delete Workspace</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Transfer Ownership Dialog */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <ShieldAlert className="size-5 text-amber-600" />
              Transfer Workspace Ownership
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select an active member who will become the new Owner of{" "}
              <span className="font-semibold text-foreground">{workspaceSlug}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-700 dark:text-amber-400 space-y-1">
              <p className="font-semibold">⚠️ Irreversible Transfer:</p>
              <p>
                Once transferred, the new Owner will have complete control over subscription billing, member roles, and workspace deletion. Your role will be reassigned as Admin.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Select New Owner
              </label>
              {eligibleMembers.length > 0 ? (
                <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                  <SelectTrigger className="h-9 text-xs border-line bg-card">
                    <SelectValue placeholder="Choose a team member..." />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleMembers.map((m) => (
                      <SelectItem key={m.userId || m.id} value={m.userId}>
                        {m.user?.name ? `${m.user.name} (${m.user.email})` : m.user?.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
                  No other members found in this workspace. Please invite a team member before transferring ownership.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTransferOpen(false)}
              className="text-xs border-line"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!selectedMemberId || isTransferring || eligibleMembers.length === 0}
              onClick={handleTransfer}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
            >
              {isTransferring && <Loader2 className="size-3.5 animate-spin" />}
              <span>Confirm & Transfer Ownership</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Workspace Type-to-Confirm Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Workspace Permanently"
        description="This will destroy all projects, milestones, task discussions, and member associations in this workspace. There is no undo."
        confirmText="Delete Workspace"
        variant="destructive"
        requireConfirmationText={workspaceSlug}
        onConfirm={handleDelete}
      />
    </div>
  );
}
