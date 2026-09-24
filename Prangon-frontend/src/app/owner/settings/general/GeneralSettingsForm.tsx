"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { updateWorkspaceAction } from "./actions";
import { toast } from "sonner";
import { Loader2, AlertTriangle, Globe, Building2, Save } from "lucide-react";

interface GeneralSettingsFormProps {
  
  workspaceSlug?: string;
  initialName: string;
  initialLogoUrl?: string;
}

export function GeneralSettingsForm({
  workspaceSlug,
  initialName,
  initialLogoUrl,
}: GeneralSettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(workspaceSlug);
  const [timezone, setTimezone] = useState("UTC");
  const [isLoading, setIsLoading] = useState(false);
  const [showSlugConfirm, setShowSlugConfirm] = useState(false);

  const slugChanged = (slug || "").trim().toLowerCase() !== (workspaceSlug || "").toLowerCase();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (slugChanged) {
      setShowSlugConfirm(true);
    } else {
      executeSave();
    }
  };

  const executeSave = async () => {
    setIsLoading(true);
    setShowSlugConfirm(false);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", (slug || "").trim().toLowerCase());

      const result = await updateWorkspaceAction( formData);

      if (result.success) {
        toast.success(result.message);
        if (result.data?.slug && result.data.slug !== workspaceSlug) {
          toast.info(`Redirecting to /owner/settings/general...`);
          router.push(`/owner/settings/general`);
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update workspace settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <Card className="border border-border bg-card shadow-xs">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-base font-bold font-display text-foreground">
              Workspace Identity
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Manage your workspace name, URL slug identifier, and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-5">
            {/* Workspace Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                Workspace Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Corp"
                required
                className="h-9 text-xs border-line bg-card max-w-lg"
              />
            </div>

            {/* Workspace Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs font-semibold text-foreground">
                Workspace URL Slug
              </Label>
              <div className="flex items-center max-w-lg">
                <span className="inline-flex items-center px-3 h-9 text-xs text-muted-foreground bg-muted border border-r-0 border-line rounded-l-md font-mono select-none">
                  prangon.app/w/
                </span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                  }
                  required
                  className="h-9 text-xs font-mono border-line bg-card rounded-l-none"
                />
              </div>

              {slugChanged && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2.5 max-w-lg mt-2">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <span className="font-bold">Breaking change notice:</span> Changing the URL slug will invalidate all existing shared links, bookmarked URLs, and invite tokens.
                  </div>
                </div>
              )}
            </div>

            {/* Workspace Timezone */}
            <div className="space-y-2 max-w-lg">
              <Label htmlFor="timezone" className="text-xs font-semibold text-foreground">
                Default Timezone
              </Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone" className="h-9 text-xs border-line bg-card">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT / BST)</SelectItem>
                  <SelectItem value="Asia/Dhaka">Dhaka (BST / UTC+6)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST / UTC+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-2 border-t border-border flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="text-xs font-semibold gap-1.5 bg-cobalt hover:bg-cobalt/90 text-white shadow-xs"
            >
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              <span>Save Changes</span>
            </Button>
          </CardFooter>
        </Card>
      </form>

      <ConfirmDialog
        open={showSlugConfirm}
        onOpenChange={setShowSlugConfirm}
        title="Confirm Workspace URL Change"
        description={`Changing your workspace slug from "${workspaceSlug}" to "${slug}" will immediately break all current browser bookmarks, integrations, and member links pointing to the old address. Are you sure you want to proceed?`}
        confirmText="Yes, Change Slug"
        variant="destructive"
        onConfirm={executeSave}
      />
    </>
  );
}
