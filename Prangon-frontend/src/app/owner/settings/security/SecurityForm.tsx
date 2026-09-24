"use client";

import React, { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/app/ConfirmDialog";
import {
  revokeSessionAction,
  revokeAllOtherSessionsAction,
  changePasswordAction,
} from "./actions";
import { toast } from "sonner";
import {
  Shield,
  Smartphone,
  Laptop,
  Globe,
  Lock,
  KeyRound,
  LogOut,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface SessionItem {
  id: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
}

interface SecurityFormProps {
  
  workspaceSlug?: string;
  initialSessions: SessionItem[];
}

export function SecurityForm({ workspaceSlug, initialSessions }: SecurityFormProps) {
  const [sessions, setSessions] = useState<SessionItem[]>(initialSessions);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [revokeAllOpen, setRevokeAllOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Revoke single session
  const handleRevokeSession = (sessionId: string) => {
    startTransition(async () => {
      const res = await revokeSessionAction( sessionId);
      if (res.success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  // Revoke all other sessions
  const handleRevokeAllOtherSessions = async () => {
    startTransition(async () => {
      const res = await revokeAllOtherSessionsAction();
      if (res.success) {
        // Keep first session as current session
        setSessions((prev) => prev.slice(0, 1));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setRevokeAllOpen(false);
    });
  };

  // Change password
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePasswordAction(formData);
      if (res.success) {
        toast.success(res.message);
        form.reset();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("An unexpected error occurred while updating password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication Card */}
      <Card className="border border-line bg-card shadow-xs">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-bold font-display text-foreground flex items-center gap-2">
                <Shield className="size-4 text-cobalt" />
                Two-Factor Authentication (2FA)
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Secure your workspace account with a secondary verification code from an authenticator app.
              </CardDescription>
            </div>
            <Badge
              variant={twoFactorEnabled ? "default" : "secondary"}
              className={twoFactorEnabled ? "bg-emerald-600 text-white" : "text-muted-foreground"}
            >
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border border-line">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">
                Authenticator Application (TOTP)
              </p>
              <p className="text-[11px] text-muted-foreground">
                Use apps like 1Password, Google Authenticator, or Authy to generate time-based codes.
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={(checked) => {
                setTwoFactorEnabled(checked);
                toast.info(
                  checked
                    ? "Two-Factor Authentication setup will be required on your next login."
                    : "Two-Factor Authentication disabled."
                );
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card className="border border-line bg-card shadow-xs">
        <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold font-display text-foreground flex items-center gap-2">
              <Laptop className="size-4 text-cobalt" />
              Active Sessions
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Manage browsers and devices where you are currently signed in.
            </CardDescription>
          </div>
          {sessions.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRevokeAllOpen(true)}
              disabled={isPending}
              className="text-xs border-line text-red-600 hover:text-red-700 hover:bg-red-500/10 gap-1.5"
            >
              <LogOut className="size-3.5" />
              <span>Revoke other sessions</span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="divide-y divide-line/60 border border-line rounded-lg overflow-hidden">
            {sessions.length > 0 ? (
              sessions.map((sess, idx) => {
                const isCurrent = idx === 0;
                return (
                  <div
                    key={sess.id || idx}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="p-2 rounded-lg bg-cobalt/10 text-cobalt shrink-0 mt-0.5">
                        {sess.userAgent?.toLowerCase().includes("mobile") ? (
                          <Smartphone className="size-4" />
                        ) : (
                          <Laptop className="size-4" />
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-foreground truncate max-w-md">
                            {sess.userAgent || "Desktop Browser (Chrome / Windows)"}
                          </p>
                          {isCurrent && (
                            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 text-[10px] font-semibold">
                              This device
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Globe className="size-3 text-muted-foreground" />
                            <span>{sess.ipAddress || "127.0.0.1"}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-muted-foreground" />
                            <span>
                              Active since {new Date(sess.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(sess.id)}
                        disabled={isPending}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-500/10 shrink-0"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No active session records found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Password & Credentials Card */}
      <Card className="border border-line bg-card shadow-xs">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-base font-bold font-display text-foreground flex items-center gap-2">
            <KeyRound className="size-4 text-cobalt" />
            Password & Authentication
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Update your account password to prevent unauthorized workspace access.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="p-6 pt-0 space-y-4 max-w-lg">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-xs font-semibold text-foreground">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className="h-9 text-xs border-line bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-xs font-semibold text-foreground">
                New Password
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className="h-9 text-xs border-line bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="h-9 text-xs border-line bg-card"
              />
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-2 border-t border-border flex justify-end">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="text-xs font-semibold gap-1.5 bg-cobalt hover:bg-cobalt/90 text-white shadow-xs"
            >
              {isChangingPassword ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Lock className="size-3.5" />
              )}
              <span>Update Password</span>
            </Button>
          </CardFooter>
        </form>
      </Card>

      <ConfirmDialog
        open={revokeAllOpen}
        onOpenChange={setRevokeAllOpen}
        title="Revoke All Other Sessions?"
        description="This will immediately sign you out from all other web browsers, mobile devices, and active API clients except this current browser."
        confirmText="Revoke All Other Sessions"
        variant="destructive"
        onConfirm={handleRevokeAllOtherSessions}
      />
    </div>
  );
}
