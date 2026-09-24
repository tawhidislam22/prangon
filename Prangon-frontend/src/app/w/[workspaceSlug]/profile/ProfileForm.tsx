"use client";

import React, { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import { updateProfileAction, logoutAllSessionsAction } from "./actions";
import { toast } from "sonner";
import {
  User,
  Mail,
  Bell,
  LogOut,
  Save,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  emailVerified?: boolean;
  role?: string;
  image?: string | null;
  createdAt?: string;
}

interface ProfileFormProps {
  user: UserProfile;
  workspaceSlug: string;
}

export function ProfileForm({ user, workspaceSlug }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [emailDigest, setEmailDigest] = useState(true);
  const [taskAlerts, setTaskAlerts] = useState(true);
  const [workspaceAnnouncements, setWorkspaceAnnouncements] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);

      const res = await updateProfileAction(formData);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to update profile information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAllSessions = async () => {
    setIsLoggingOut(true);
    try {
      const res = await logoutAllSessionsAction();
      if (res.success) {
        toast.success("Successfully logged out from all sessions.");
        router.push("/login");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to log out of sessions");
    } finally {
      setIsLoggingOut(false);
      setLogoutOpen(false);
    }
  };

  const initials = (name || user.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Profile Details Card */}
      <form onSubmit={handleUpdateProfile}>
        <Card className="border border-line bg-card shadow-xs">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-base font-bold font-display text-foreground flex items-center gap-2">
              <User className="size-4 text-cobalt" />
              Personal Details
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Manage your personal identity and how you appear across workspaces.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-5">
            {/* Avatar & Initials display */}
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-cobalt text-white flex items-center justify-center text-lg font-bold shadow-xs">
                {initials}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Badge className="bg-cobalt/10 text-cobalt border-cobalt/20 text-[10px]">
                    {user.role || "Member"}
                  </Badge>
                  {user.emailVerified && (
                    <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 text-[10px] gap-1">
                      <CheckCircle2 className="size-2.5" />
                      <span>Verified</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2 max-w-md">
              <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                Display Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="h-9 text-xs border-line bg-card"
              />
            </div>

            {/* Email (Read Only) */}
            <div className="space-y-2 max-w-md">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="h-9 text-xs border-line bg-muted text-muted-foreground pr-8 cursor-not-allowed"
                />
                <ShieldCheck className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-emerald-600" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Your email address is managed via your primary account authentication.
              </p>
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
              <span>Save Profile</span>
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Notification Preferences Card */}
      <Card className="border border-line bg-card shadow-xs">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-base font-bold font-display text-foreground flex items-center gap-2">
            <Bell className="size-4 text-cobalt" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Configure how and when you receive workspace digests and alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-lg border border-line">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">Task Assignments & Mentions</p>
              <p className="text-[11px] text-muted-foreground">
                Receive notifications when you are assigned a task or mentioned in task comments.
              </p>
            </div>
            <Switch
              checked={taskAlerts}
              onCheckedChange={(c) => {
                setTaskAlerts(c);
                toast.success(c ? "Task alerts enabled" : "Task alerts disabled");
              }}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-lg border border-line">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">Weekly Digest Emails</p>
              <p className="text-[11px] text-muted-foreground">
                A summary of completed milestones, upcoming deadlines, and team activity.
              </p>
            </div>
            <Switch
              checked={emailDigest}
              onCheckedChange={(c) => {
                setEmailDigest(c);
                toast.success(c ? "Weekly digest enabled" : "Weekly digest disabled");
              }}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-lg border border-line">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">Workspace Announcements</p>
              <p className="text-[11px] text-muted-foreground">
                Updates about member invites, workspace billing, and integration alerts.
              </p>
            </div>
            <Switch
              checked={workspaceAnnouncements}
              onCheckedChange={(c) => {
                setWorkspaceAnnouncements(c);
                toast.success(c ? "Announcements enabled" : "Announcements disabled");
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Security & Sign Out Card */}
      <Card className="border border-line bg-card shadow-xs">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-base font-bold font-display text-foreground flex items-center gap-2">
            <LogOut className="size-4 text-cobalt" />
            Session Security
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Sign out of active sessions if you suspect unauthorized access.
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-6 pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLogoutOpen(true)}
            className="text-xs border-line text-red-600 hover:text-red-700 hover:bg-red-500/10 gap-1.5"
          >
            <LogOut className="size-3.5" />
            <span>Log out of all devices</span>
          </Button>
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out of all active devices?"
        description="You will be immediately signed out from all web browsers, tablets, and mobile devices, including this current session. You will need to log back in."
        confirmText="Yes, Log Out Everywhere"
        variant="destructive"
        onConfirm={handleLogoutAllSessions}
      />
    </div>
  );
}
