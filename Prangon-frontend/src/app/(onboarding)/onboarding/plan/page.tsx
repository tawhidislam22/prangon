"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, ArrowLeft, Loader2 } from "lucide-react";
import { updateOnboardingDraftAction } from "@/services/onboarding.services";

export default function OnboardingPlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<"FREE" | "PREMIUM" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectPlan = async (plan: "FREE" | "PREMIUM") => {
    setLoading(plan);
    setError(null);

    if (plan === "FREE") {
      const res = await updateOnboardingDraftAction({
        selectedTier: "FREE",
        status: "PENDING_WORKSPACE",
      });

      if (res.success) {
        // Free tier skips payment directly to workspace creation!
        router.push("/onboarding/workspace");
      } else {
        setError(res.message || "Failed to update plan selection");
        setLoading(null);
      }
    } else {
      const res = await updateOnboardingDraftAction({
        selectedTier: "PREMIUM",
        status: "PENDING_PAYMENT",
      });

      if (res.success) {
        router.push("/onboarding/payment");
      } else {
        setError(res.message || "Failed to update plan selection");
        setLoading(null);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <StepIndicator currentStep={2} />

      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-line dark:border-slate-800 p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cobalt/10 text-cobalt mb-2">
            <Zap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink dark:text-white tracking-tight">
            Choose your plan
          </h1>
          <p className="text-sm text-graphite dark:text-slate-400 max-w-md mx-auto">
            Pick the plan that fits your stage. You can change plans or cancel at any time from your settings.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Starter Plan */}
          <div className="border border-line dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition-all bg-card/40">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-graphite dark:text-slate-400">
                  Starter
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-graphite dark:text-slate-300">
                  Free Forever
                </span>
              </div>
              <div className="text-3xl font-bold font-display text-ink dark:text-white mb-2">
                $0
                <span className="text-sm font-normal text-graphite dark:text-slate-400 ml-1">
                  / month
                </span>
              </div>
              <p className="text-sm text-graphite dark:text-slate-400 mb-6">
                Great for individuals and small teams getting projects organized.
              </p>

              <div className="space-y-3 mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-graphite/70 dark:text-slate-500">
                  Includes:
                </p>
                <div className="flex items-center gap-2.5 text-sm text-ink dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Up to 5 workspace members</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-ink dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>3 active projects</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-ink dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>500 MB storage</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-ink dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Kanban board & list views</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => selectPlan("FREE")}
              disabled={loading !== null}
              className="w-full h-11 border-line font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {loading === "FREE" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up Starter...
                </>
              ) : (
                "Continue with Starter"
              )}
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-cobalt rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xl shadow-cobalt/10 bg-cobalt/[0.02] dark:bg-cobalt/[0.05]">
            <div className="absolute -top-3 right-6 bg-cobalt text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cobalt">
                  Premium
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cobalt/10 text-cobalt">
                  Full Power
                </span>
              </div>
              <div className="text-3xl font-bold font-display text-ink dark:text-white mb-2">
                $19
                <span className="text-sm font-normal text-graphite dark:text-slate-400 ml-1">
                  / month
                </span>
              </div>
              <p className="text-sm text-graphite dark:text-slate-400 mb-6">
                For fast-moving teams that need complete visibility, scaling, and priority support.
              </p>

              <div className="space-y-3 mb-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-cobalt/80">
                  Everything in Starter, plus:
                </p>
                <div className="flex items-center gap-2.5 text-sm font-medium text-ink dark:text-slate-200">
                  <Check className="w-4 h-4 text-cobalt shrink-0 stroke-[2.5]" />
                  <span>Unlimited team members</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-ink dark:text-slate-200">
                  <Check className="w-4 h-4 text-cobalt shrink-0 stroke-[2.5]" />
                  <span>Unlimited projects & boards</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-ink dark:text-slate-200">
                  <Check className="w-4 h-4 text-cobalt shrink-0 stroke-[2.5]" />
                  <span>50 GB file storage</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-ink dark:text-slate-200">
                  <Check className="w-4 h-4 text-cobalt shrink-0 stroke-[2.5]" />
                  <span>Custom roles & permissions</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-ink dark:text-slate-200">
                  <Check className="w-4 h-4 text-cobalt shrink-0 stroke-[2.5]" />
                  <span>Priority 24/7 customer support</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => selectPlan("PREMIUM")}
              disabled={loading !== null}
              className="w-full h-11 bg-cobalt hover:bg-cobalt/90 text-white font-medium shadow-md shadow-cobalt/25 transition-all cursor-pointer"
            >
              {loading === "PREMIUM" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Proceeding to checkout...
                </>
              ) : (
                "Upgrade to Premium ($19/mo)"
              )}
            </Button>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Link
            href="/onboarding/company"
            className="inline-flex items-center gap-1.5 text-xs text-graphite dark:text-slate-400 hover:text-ink dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to company details
          </Link>
        </div>
      </div>
    </div>
  );
}
