"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  acceptInvitationAction,
  getInvitationDetailsAction,
  getCurrentUserAction,
  switchAccountLogoutAction,
} from "./_action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  UserCheck,
  ArrowRight,
  LogOut,
  Mail,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface InvitationData {
  id: string;
  email: string;
  role: "MEMBER" | "ADMIN" | "OWNER";
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "REJECTED";
  expiresAt: string;
  workspace?: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  inviter?: {
    id: string;
    name?: string;
    email?: string;
  };
}

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const workspaceSlugParam = searchParams.get("workspace") || "";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [status, setStatus] = useState<"ready" | "success" | "error" | "mismatch">("ready");
  const [errorMessage, setErrorMessage] = useState("");

  const currentUrl = typeof window !== "undefined"
    ? `/accept-invitation?token=${token}${workspaceSlugParam ? `&workspace=${workspaceSlugParam}` : ""}`
    : "/accept-invitation";

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setStatus("error");
      setErrorMessage("No invitation token found in the URL. Please verify the invitation link.");
      return;
    }

    async function loadData() {
      setLoading(true);

      // 1. Fetch current logged-in user (if any)
      const user = await getCurrentUserAction();
      setCurrentUser(user);

      // 2. Fetch invitation details
      const invRes = await getInvitationDetailsAction(token);

      if (!invRes.success || !invRes.data) {
        setStatus("error");
        setErrorMessage(invRes.message || "Invitation not found or no longer valid.");
        setLoading(false);
        return;
      }

      const inv: InvitationData = invRes.data;
      setInvitation(inv);

      if (inv.status === "EXPIRED") {
        setStatus("error");
        setErrorMessage("This invitation has expired. Please contact the workspace owner to send a new invitation.");
        setLoading(false);
        return;
      }

      // Check if user is logged in
      if (user?.email) {
        const invEmail = inv.email.trim().toLowerCase();
        const userEmail = user.email.trim().toLowerCase();

        if (invEmail !== userEmail) {
          setStatus("mismatch");
          setLoading(false);
          return;
        }

        // Email matches! User is logged in and ready. Auto-accept for a seamless experience
        handleAccept(inv.workspace?.slug || workspaceSlugParam);
      } else {
        // User not logged in, prompt them to sign in or register
        setStatus("ready");
        setLoading(false);
      }
    }

    loadData();
  }, [token, workspaceSlugParam]);

  const handleAccept = async (targetSlug?: string) => {
    setAccepting(true);
    const result = await acceptInvitationAction(token);

    if (result.success) {
      setStatus("success");
      toast.success(result.message || "Invitation accepted successfully!");

      const destination = `/owner/dashboard`;
      setTimeout(() => {
        router.push(destination);
      }, 1200);
    } else {
      setStatus("error");
      setErrorMessage(result.message || "Failed to accept invitation.");
    }
    setAccepting(false);
    setLoading(false);
  };

  const handleSwitchAccount = async () => {
    await switchAccountLogoutAction();
    router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
  };

  const workspaceName = invitation?.workspace?.name || workspaceSlugParam.replace(/-/g, " ") || "Workspace";
  const inviterName = invitation?.inviter?.name || invitation?.inviter?.email || "A team admin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg shadow-xl border border-border bg-card">
        {/* Header */}
        <CardHeader className="text-center pb-2">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mx-auto mb-3 shadow-2xs">
            <Building2 className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold font-display tracking-tight text-foreground">
            Workspace Invitation
          </CardTitle>
          <CardDescription className="text-sm">
            {loading && "Verifying your invitation details..."}
            {!loading && status === "ready" && "You've been invited to collaborate."}
            {!loading && status === "success" && "Welcome aboard!"}
            {!loading && status === "mismatch" && "Account mismatch detected"}
            {!loading && status === "error" && "Unable to join workspace"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading invitation details...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && status === "error" && (
            <div className="flex flex-col items-center text-center py-4 space-y-3">
              <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <XCircle className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">Invitation Error</p>
                <p className="text-xs text-muted-foreground max-w-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success State */}
          {!loading && status === "success" && (
            <div className="flex flex-col items-center text-center py-6 space-y-3">
              <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-foreground">
                  You joined {workspaceName}!
                </p>
                <p className="text-xs text-muted-foreground">
                  Redirecting to your workspace dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Invitation Details Card (for ready or mismatch) */}
          {!loading && (status === "ready" || status === "mismatch") && invitation && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Workspace</span>
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-primary" />
                    {workspaceName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Invited By</span>
                  <span className="text-xs font-semibold text-foreground">{inviterName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Role</span>
                  <Badge variant="indigo" className="text-[11px] font-semibold px-2 py-0.5">
                    {invitation.role || "MEMBER"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Sent to</span>
                  <span className="text-xs font-mono font-medium text-foreground">{invitation.email}</span>
                </div>
              </div>

              {/* Mismatch Alert */}
              {status === "mismatch" && (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs">
                    <AlertTriangle className="size-4 shrink-0" />
                    <span>Signed in with a different account</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You are signed in as <strong className="text-foreground">{currentUser?.email}</strong>, but this invitation was sent to <strong className="text-foreground">{invitation.email}</strong>.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please switch to the invited account to accept this invitation.
                  </p>
                </div>
              )}

              {/* Unauthenticated Ready State */}
              {status === "ready" && !currentUser && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                    <Mail className="size-4 shrink-0" />
                    <span>Authentication Required</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    To join <strong className="text-foreground">{workspaceName}</strong>, please log in or register with your email address (<strong className="text-foreground">{invitation.email}</strong>).
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2.5 border-t border-border pt-4">
          {/* Action buttons based on state */}
          {status === "ready" && !currentUser && (
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <Link
                href={`/login?redirect=${encodeURIComponent(currentUrl)}`}
                className="flex-1"
              >
                <Button className="w-full font-semibold text-xs gap-1.5 shadow-xs">
                  <span>Sign In with {invitation?.email || "Email"}</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
              <Link
                href={`/register?redirect=${encodeURIComponent(currentUrl)}`}
                className="flex-1"
              >
                <Button variant="outline" className="w-full font-semibold text-xs border-border">
                  Create Account
                </Button>
              </Link>
            </div>
          )}

          {status === "ready" && currentUser && (
            <Button
              className="w-full font-semibold text-xs gap-1.5"
              onClick={() => handleAccept(invitation?.workspace?.slug || workspaceSlugParam)}
              disabled={accepting}
            >
              {accepting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Joining Workspace...</span>
                </>
              ) : (
                <>
                  <span>Accept Invitation & Join</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          )}

          {status === "mismatch" && (
            <div className="w-full flex flex-col gap-2">
              <Button
                variant="default"
                className="w-full font-semibold text-xs gap-1.5"
                onClick={handleSwitchAccount}
              >
                <LogOut className="size-3.5" />
                <span>Switch to {invitation?.email}</span>
              </Button>
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full font-semibold text-xs">
                  Continue as {currentUser?.email}
                </Button>
              </Link>
            </div>
          )}

          {status === "error" && (
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full font-semibold text-xs">
                Return to Dashboard
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
