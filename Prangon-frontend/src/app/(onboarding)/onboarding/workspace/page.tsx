"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getOnboardingDraftAction,
  updateOnboardingDraftAction,
  createOnboardingWorkspaceAction,
} from "@/services/onboarding.services";
import {
  LayoutDashboard,
  Globe,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function OnboardingWorkspacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get("success") === "true";

  const [loading, setLoading] = useState(false);
  const [fetchingDraft, setFetchingDraft] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [tier, setTier] = useState<string>("FREE");
  const [industry, setIndustry] = useState<string | undefined>();
  const [companySize, setCompanySize] = useState<string | undefined>();
  const [existingWorkspaceSlug, setExistingWorkspaceSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const draft = await getOnboardingDraftAction();
        if (draft) {
          if (draft.companyName && !name) {
            setName(draft.companyName);
            setSlug(generateSlug(draft.companyName));
          }
          if (draft.selectedTier) {
            setTier(draft.selectedTier);
          }
          if (draft.industry) setIndustry(draft.industry);
          if (draft.companySize) setCompanySize(draft.companySize);
          if (draft.workspaceSlug) {
            setExistingWorkspaceSlug(draft.workspaceSlug);
            setSlug(draft.workspaceSlug);
          }
        }

        const querySlug = searchParams.get("workspace");
        if (querySlug) {
          setExistingWorkspaceSlug(querySlug);
          setSlug(querySlug);
        }
      } catch (err) {
        console.error("Failed to load onboarding draft:", err);
      } finally {
        setFetchingDraft(false);
      }
    }
    loadData();
  }, [searchParams, name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!isSlugCustomized) {
      setSlug(generateSlug(newName));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugCustomized(true);
    setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a workspace name");
      return;
    }
    if (!slug.trim() || slug.length < 3) {
      setError("Slug must be at least 3 characters");
      return;
    }

    setLoading(true);
    setError(null);

    // If workspace already exists (e.g. from Stripe webhook creation), proceed directly
    if (existingWorkspaceSlug) {
      await updateOnboardingDraftAction({
        workspaceSlug: existingWorkspaceSlug,
        workspaceName: name,
        status: "PENDING_WORKSPACE",
      });
      router.push(`/onboarding/invite?workspace=${existingWorkspaceSlug}`);
      return;
    }

    // Create workspace
    const res = await createOnboardingWorkspaceAction({
      name: name.trim(),
      slug: slug.trim(),
      industry,
      companySize,
      tier: tier === "PREMIUM" ? "PREMIUM" : "FREE",
      onboardingStatus: "COMPLETED",
    });

    if (res.success && res.data) {
      const createdSlug = res.data.slug || slug;
      await updateOnboardingDraftAction({
        workspaceId: res.data.id,
        workspaceSlug: createdSlug,
        workspaceName: res.data.name,
        status: "COMPLETED",
      });
      router.push(`/onboarding/invite?workspace=${createdSlug}`);
    } else {
      setError(res.message || "Failed to create workspace. The slug might already be taken.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <StepIndicator currentStep={4} />

      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-line dark:border-slate-800 p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cobalt/10 text-cobalt mb-2">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink dark:text-white tracking-tight">
            Name your workspace
          </h1>
          <p className="text-sm text-graphite dark:text-slate-400 max-w-sm mx-auto">
            This is the shared environment where your team will manage projects and tasks.
          </p>
        </div>

        {paymentSuccess && (
          <div className="flex items-center gap-2 p-3 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Payment successful! Your Premium membership is activated. Now let's finalize your workspace.</span>
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workspace Name */}
          <div className="space-y-2">
            <Label htmlFor="workspaceName" className="text-xs font-semibold uppercase tracking-wider text-graphite dark:text-slate-300">
              Workspace Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="workspaceName"
              placeholder="e.g. Acme Studio"
              value={name}
              onChange={handleNameChange}
              disabled={loading || fetchingDraft}
              required
              autoFocus
              className="h-11 px-4 text-base focus-visible:ring-cobalt"
            />
          </div>

          {/* Workspace Slug */}
          <div className="space-y-2">
            <Label htmlFor="workspaceSlug" className="text-xs font-semibold uppercase tracking-wider text-graphite dark:text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Workspace URL Slug
            </Label>
            <div className="flex items-center rounded-lg border border-line dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-3 focus-within:border-cobalt focus-within:ring-2 focus-within:ring-cobalt/20">
              <span className="text-xs text-graphite/70 dark:text-slate-500 select-none">
                prangon.app/w/
              </span>
              <Input
                id="workspaceSlug"
                value={slug}
                onChange={handleSlugChange}
                disabled={loading || fetchingDraft || !!existingWorkspaceSlug}
                className="h-11 border-0 bg-transparent px-1 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-ink dark:text-white"
                placeholder="acme-studio"
              />
            </div>
            <p className="text-[11px] text-graphite dark:text-slate-500">
              Letters, numbers, and hyphens only.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || fetchingDraft || !name.trim() || !slug.trim()}
            className="w-full h-12 bg-cobalt hover:bg-cobalt/90 text-white font-medium text-base shadow-lg shadow-cobalt/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting up workspace...
              </>
            ) : (
              <>
                Continue to Team Setup
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
