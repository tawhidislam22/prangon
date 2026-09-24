"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getOnboardingDraftAction,
  inviteTeammatesAction,
} from "@/services/onboarding.services";
import {
  UserPlus,
  Plus,
  Trash2,
  ArrowRight,
  Loader2,
  Mail,
  Shield,
} from "lucide-react";

interface InviteRow {
  id: string;
  email: string;
  role: "MEMBER" | "ADMIN";
}

export default function OnboardingInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workspaceSlug, setWorkspaceSlug] = useState<string>("");
  const [rows, setRows] = useState<InviteRow[]>([
    { id: "1", email: "", role: "MEMBER" },
    { id: "2", email: "", role: "MEMBER" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkspace() {
      const q = searchParams.get("workspace");
      if (q) {
        setWorkspaceSlug(q);
        return;
      }
      const draft = await getOnboardingDraftAction();
      if (draft?.workspaceSlug) {
        setWorkspaceSlug(draft.workspaceSlug);
      }
    }
    loadWorkspace();
  }, [searchParams]);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: Date.now().toString(), email: "", role: "MEMBER" },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, field: "email" | "role", value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSkip = () => {
    const targetSlug = workspaceSlug || "dashboard";
    router.push(`/onboarding/complete?workspace=${targetSlug}`);
  };

  const handleSendInvites = async (e: React.FormEvent) => {
    e.preventDefault();
    const validEmails = rows
      .map((r) => r.email.trim())
      .filter((em) => em.length > 0 && em.includes("@"));

    if (validEmails.length === 0) {
      handleSkip();
      return;
    }

    setLoading(true);
    setError(null);

    const res = await inviteTeammatesAction(workspaceSlug, validEmails);
    if (res.success) {
      router.push(`/onboarding/complete?workspace=${workspaceSlug}`);
    } else {
      setError(res.message || "Some invitations could not be sent.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <StepIndicator currentStep={5} />

      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-line dark:border-slate-800 p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cobalt/10 text-cobalt mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink dark:text-white tracking-tight">
            Invite your team
          </h1>
          <p className="text-sm text-graphite dark:text-slate-400 max-w-sm mx-auto">
            Collaboration happens in real-time. Invite your colleagues now or invite them anytime later.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSendInvites} className="space-y-4">
          <div className="space-y-3">
            {rows.map((row, index) => (
              <div key={row.id} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-graphite/60 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    placeholder={`colleague${index + 1}@company.com`}
                    type="email"
                    value={row.email}
                    onChange={(e) => updateRow(row.id, "email", e.target.value)}
                    className="h-11 pl-9 text-sm"
                    disabled={loading}
                  />
                </div>

                <div className="w-28 sm:w-32">
                  <select
                    value={row.role}
                    onChange={(e) =>
                      updateRow(row.id, "role", e.target.value as "MEMBER" | "ADMIN")
                    }
                    disabled={loading}
                    className="w-full h-11 px-2.5 rounded-md border border-line dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-ink dark:text-white focus:ring-2 focus:ring-cobalt focus:outline-none"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    disabled={loading}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-graphite/60 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cobalt hover:text-cobalt/80 transition-colors pt-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add another team member
          </button>

          <div className="pt-4 space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-cobalt hover:bg-cobalt/90 text-white font-medium text-base shadow-lg shadow-cobalt/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending invitations...
                </>
              ) : (
                <>
                  Invite & Complete Setup
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              disabled={loading}
              className="w-full text-xs text-graphite dark:text-slate-400 hover:text-ink dark:hover:text-white"
            >
              Skip for now, I'll invite later
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
