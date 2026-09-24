"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IProject } from "@/types/project.types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { updateProject, deleteProject } from "@/services/project.services";
import { toast } from "sonner";
import { Trash2, Archive, Save, Loader2 } from "lucide-react";

interface ProjectSettingsTabProps {
  workspaceSlug: string;
  project: IProject;
  canManage: boolean;
}

export function ProjectSettingsTab({
  workspaceSlug,
  project,
  canManage,
}: ProjectSettingsTabProps) {
  const router = useRouter();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    setSaving(true);
    try {
      const res = await updateProject(project.id, {
        name,
        description,
      });
      if (res.success) {
        toast.success("Project updated successfully");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update project settings");
      }
    } catch {
      toast.error("Failed to update project settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canManage) return;

    setDeleting(true);
    try {
      const res = await deleteProject(project.id);
      if (res.success) {
        toast.success("Project deleted successfully");
        router.push(`/w/${workspaceSlug}/projects`);
      } else {
        toast.error(res.message || "Failed to delete project");
      }
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="border border-border bg-card shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Project Details</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Update project identity, purpose, and scope.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="p-5 pt-2 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="projectName" className="text-xs">Project Name</Label>
              <Input
                id="projectName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!canManage || saving}
                className="text-xs h-9 bg-card"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="projectDesc" className="text-xs">Description</Label>
              <Textarea
                id="projectDesc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!canManage || saving}
                placeholder="Details and objectives of this project..."
                className="text-xs min-h-[90px] bg-card"
              />
            </div>
          </CardContent>

          {canManage && (
            <CardFooter className="p-5 pt-0 flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={saving}
                className="bg-cobalt hover:bg-cobalt/90 text-white text-xs gap-1.5"
              >
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                <span>Save Changes</span>
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>

      {/* Danger Actions (Owner/Admin) */}
      {canManage && (
        <Card className="border border-red-200 bg-red-50/20 shadow-xs">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold text-red-700">Delete Project</CardTitle>
            <CardDescription className="text-xs text-red-600/80">
              Permanently delete this project and all of its tasks, boards, and comments.
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
              <span>Delete Project</span>
            </Button>
          </CardFooter>
        </Card>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${project.name}?`}
        description="This will permanently delete this project, all associated tasks, and discussions. This cannot be undone."
        confirmText="Delete Project"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
