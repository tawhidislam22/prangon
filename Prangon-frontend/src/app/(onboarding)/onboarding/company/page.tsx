"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getOnboardingDraftAction,
  updateOnboardingDraftAction,
} from "@/services/onboarding.services";
import { Building2, Users2, Briefcase, ArrowRight, Loader2 } from "lucide-react";

const INDUSTRIES = [
  "Software & Technology",
  "Design & Creative Agency",
  "Marketing & Advertising",
  "E-Commerce & Retail",
  "Finance & Banking",
  "Healthcare & Life Sciences",
  "Education & Non-profit",
  "Consulting & Professional Services",
  "Other",
];

const COMPANY_SIZES = [
  { label: "Just me", value: "1" },
  { label: "2 - 10", value: "2-10" },
  { label: "11 - 50", value: "11-50" },
  { label: "51 - 200", value: "51-200" },
  { label: "201+", value: "201+" },
];

export default function OnboardingCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingDraft, setFetchingDraft] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("2-10");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDraft() {
      try {
        const draft = await getOnboardingDraftAction();
        if (draft) {
          if (draft.companyName) setCompanyName(draft.companyName);
          if (draft.industry) setIndustry(draft.industry);
          if (draft.companySize) setCompanySize(draft.companySize);
        }
      } catch (err) {
        console.error("Failed to load draft:", err);
      } finally {
        setFetchingDraft(false);
      }
    }
    loadDraft();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError("Please enter your company or team name");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await updateOnboardingDraftAction({
      companyName: companyName.trim(),
      industry: industry || undefined,
      companySize: companySize || undefined,
      status: "PENDING_PLAN",
    });

    if (res.success) {
      router.push("/onboarding/plan");
    } else {
      setError(res.message || "Failed to save company details");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl">
      <StepIndicator currentStep={1} />

      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-line dark:border-slate-800 p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cobalt/10 text-cobalt mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink dark:text-white tracking-tight">
            Tell us about your company
          </h1>
          <p className="text-sm text-graphite dark:text-slate-400 max-w-sm mx-auto">
            We'll tailor your workspace, project defaults, and team structure to match your organization.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-xs font-semibold uppercase tracking-wider text-graphite dark:text-slate-300">
              Company or Organization Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="companyName"
                placeholder="e.g. Acme Corp or Studio Design"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={loading || fetchingDraft}
                required
                autoFocus
                className="h-11 px-4 text-base focus-visible:ring-cobalt"
              />
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-xs font-semibold uppercase tracking-wider text-graphite dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Industry
            </Label>
            <Select
              value={industry}
              onValueChange={setIndustry}
              disabled={loading || fetchingDraft}
            >
              <SelectTrigger id="industry" className="h-11">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-graphite dark:text-slate-300 flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5" />
              Company Size (People)
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
              {COMPANY_SIZES.map((size) => {
                const selected = companySize === size.value;
                return (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setCompanySize(size.value)}
                    disabled={loading || fetchingDraft}
                    className={`h-11 rounded-lg border text-sm font-medium transition-all duration-150 flex items-center justify-center cursor-pointer ${
                      selected
                        ? "border-cobalt bg-cobalt/10 text-cobalt font-semibold ring-2 ring-cobalt/20"
                        : "border-line dark:border-slate-800 hover:border-slate-400 text-graphite dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {size.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || fetchingDraft || !companyName.trim()}
            className="w-full h-12 bg-cobalt hover:bg-cobalt/90 text-white font-medium text-base shadow-lg shadow-cobalt/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving details...
              </>
            ) : (
              <>
                Continue to Plan Selection
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
