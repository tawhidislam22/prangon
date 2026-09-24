"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  FolderKanban,
  Users,
  Settings,
  Loader2,
} from "lucide-react";
import {
  getOnboardingDraftAction,
  completeOnboardingAction,
} from "@/services/onboarding.services";

export default function OnboardingCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workspaceSlug, setWorkspaceSlug] = useState<string>("");
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [plan, setPlan] = useState<string>("FREE");
  const [completing, setCompleting] = useState(true);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    async function finalize() {
      try {
        const draft = await getOnboardingDraftAction();
        const paramSlug = searchParams.get("workspace") || draft?.workspaceSlug || "";
        const name = draft?.companyName || draft?.workspaceName || "Workspace";
        const tier = draft?.selectedTier || "FREE";

        setWorkspaceSlug(paramSlug);
        setWorkspaceName(name);
        setPlan(tier);

        if (paramSlug) {
          // Permanently unlock workspace dashboard
          await completeOnboardingAction(paramSlug);
        }
      } catch (err) {
        console.error("Error finalizing onboarding:", err);
      } finally {
        setCompleting(false);
      }
    }
    finalize();
  }, [searchParams]);

  const handleGoToDashboard = () => {
    setNavigating(true);
    const targetSlug = workspaceSlug || searchParams.get("workspace") || "";
    const target = targetSlug && targetSlug !== "dashboard" ? `/w/${targetSlug}/dashboard` : "/dashboard";
    window.location.assign(target);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-line dark:border-slate-800 p-8 sm:p-10 space-y-8 text-center">
        {/* Animated Celebration Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 animate-ping" />
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 relative z-10">
            <CheckCircle className="w-10 h-10 stroke-[2.5]" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink dark:text-white tracking-tight">
            You're all set!
          </h1>
          <p className="text-sm text-graphite dark:text-slate-400 max-w-sm mx-auto">
            Your workspace is created and ready for your team. Welcome to Prangon.
          </p>
        </div>

        {/* Workspace Quick Details */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-line dark:border-slate-800 text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-line dark:border-slate-700">
            <div>
              <p className="text-xs text-graphite dark:text-slate-400 font-medium">Workspace</p>
              <p className="text-base font-bold text-ink dark:text-white">
                {workspaceName || "My Workspace"}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  plan === "PREMIUM"
                    ? "bg-cobalt/15 text-cobalt"
                    : "bg-slate-200 dark:bg-slate-700 text-graphite dark:text-slate-300"
                }`}
              >
                {plan === "PREMIUM" ? "Premium Plan" : "Starter Plan"}
              </span>
            </div>
          </div>

          <div className="text-xs text-graphite dark:text-slate-400 flex items-center gap-1.5">
            <span className="font-semibold text-ink dark:text-slate-200">Direct URL:</span>
            <span className="font-mono text-cobalt">
              prangon.app/w/{workspaceSlug || "..."}
            </span>
          </div>
        </div>

        {/* Next step suggestions */}
        <div className="grid grid-cols-3 gap-3 text-left pt-2">
          <div className="p-3 rounded-lg border border-line dark:border-slate-800 bg-paper/40">
            <FolderKanban className="w-4 h-4 text-cobalt mb-1.5" />
            <p className="text-xs font-semibold text-ink dark:text-white">Create Projects</p>
            <p className="text-[11px] text-graphite dark:text-slate-400 mt-0.5">
              Organize tasks and track progress
            </p>
          </div>
          <div className="p-3 rounded-lg border border-line dark:border-slate-800 bg-paper/40">
            <Users className="w-4 h-4 text-cobalt mb-1.5" />
            <p className="text-xs font-semibold text-ink dark:text-white">Collaborate</p>
            <p className="text-[11px] text-graphite dark:text-slate-400 mt-0.5">
              Assign roles and collaborate live
            </p>
          </div>
          <div className="p-3 rounded-lg border border-line dark:border-slate-800 bg-paper/40">
            <Settings className="w-4 h-4 text-cobalt mb-1.5" />
            <p className="text-xs font-semibold text-ink dark:text-white">Customize</p>
            <p className="text-[11px] text-graphite dark:text-slate-400 mt-0.5">
              Set preferences and notifications
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleGoToDashboard}
            disabled={completing || navigating}
            className="w-full h-12 bg-cobalt hover:bg-cobalt/90 text-white font-medium text-base shadow-lg shadow-cobalt/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {completing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finalizing setup...
              </>
            ) : navigating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Opening Dashboard...
              </>
            ) : (
              <>
                Launch Workspace Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-graphite dark:text-slate-400">
            Having trouble?{" "}
            <a
              href={workspaceSlug ? `/w/${workspaceSlug}/dashboard` : "/dashboard"}
              className="text-cobalt hover:underline font-medium"
            >
              Click here to open dashboard directly
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
