"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  getOnboardingDraftAction,
  updateOnboardingDraftAction,
  createCheckoutSessionAction,
} from "@/services/onboarding.services";

export default function OnboardingPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wasCanceled = searchParams.get("canceled") === "true";

  const [loading, setLoading] = useState(false);
  const [switchingFree, setSwitchingFree] = useState(false);
  const [checkingDraft, setCheckingDraft] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkDraft() {
      try {
        const draft = await getOnboardingDraftAction();
        if (draft && draft.selectedTier === "FREE") {
          // Free plan doesn't need payment
          router.replace("/onboarding/workspace");
          return;
        }
      } catch (err) {
        console.error("Error checking draft:", err);
      } finally {
        setCheckingDraft(false);
      }
    }
    checkDraft();
  }, [router]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    const res = await createCheckoutSessionAction();
    if (res.success && res.url) {
      // Redirect to Stripe checkout
      window.location.href = res.url;
    } else {
      setError(res.message || "Failed to start checkout session. Please try again.");
      setLoading(false);
    }
  };

  const handleSwitchToFree = async () => {
    setSwitchingFree(true);
    setError(null);

    const res = await updateOnboardingDraftAction({
      selectedTier: "FREE",
      status: "PENDING_WORKSPACE",
    });

    if (res.success) {
      router.push("/onboarding/workspace");
    } else {
      setError(res.message || "Failed to switch plan");
      setSwitchingFree(false);
    }
  };

  if (checkingDraft) {
    return (
      <div className="w-full max-w-xl text-center py-20">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-cobalt" />
        <p className="text-sm text-graphite mt-3">Loading checkout details...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <StepIndicator currentStep={3} />

      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-line dark:border-slate-800 p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cobalt/10 text-cobalt mb-2">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink dark:text-white tracking-tight">
            Complete your subscription
          </h1>
          <p className="text-sm text-graphite dark:text-slate-400 max-w-sm mx-auto">
            You're upgrading to Prangon Premium. You'll be redirected to Stripe for secure card processing.
          </p>
        </div>

        {wasCanceled && (
          <div className="flex items-center gap-2 p-3 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Checkout was canceled. You can try again or switch to the Free plan below.</span>
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg">
            {error}
          </div>
        )}

        {/* Order Summary Card */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-line dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-line dark:border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink dark:text-white">Prangon Premium</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cobalt text-white">
                  Monthly
                </span>
              </div>
              <p className="text-xs text-graphite dark:text-slate-400 mt-0.5">
                Unlimited members, unlimited projects, 50 GB storage
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-ink dark:text-white">$19.00</span>
              <span className="text-xs text-graphite dark:text-slate-400 block">/mo</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-graphite dark:text-slate-400">Due today</span>
            <span className="font-bold text-ink dark:text-white text-base">$19.00</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-graphite dark:text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted 256-bit Stripe checkout. Cancel anytime.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleCheckout}
            disabled={loading || switchingFree}
            className="w-full h-12 bg-cobalt hover:bg-cobalt/90 text-white font-medium text-base shadow-lg shadow-cobalt/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting to Stripe...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Proceed to Stripe Checkout ($19)
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleSwitchToFree}
            disabled={loading || switchingFree}
            className="w-full text-xs text-graphite dark:text-slate-400 hover:text-ink dark:hover:text-white"
          >
            {switchingFree ? "Switching to Free..." : "Continue with Starter (Free) instead"}
          </Button>
        </div>

        <div className="flex justify-center pt-1">
          <Link
            href="/onboarding/plan"
            className="inline-flex items-center gap-1.5 text-xs text-graphite dark:text-slate-400 hover:text-ink dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to plan selection
          </Link>
        </div>
      </div>
    </div>
  );
}
