"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepIndicatorProps {
  currentStep: number; // 1 to 5
  className?: string;
}

const STEPS = [
  { step: 1, title: "Company Details", shortTitle: "Company" },
  { step: 2, title: "Choose Plan", shortTitle: "Plan" },
  { step: 3, title: "Payment", shortTitle: "Payment" },
  { step: 4, title: "Workspace Setup", shortTitle: "Workspace" },
  { step: 5, title: "Invite Team", shortTitle: "Team" },
];

export function StepIndicator({ currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("w-full max-w-xl mx-auto mb-8 select-none", className)}>
      {/* Header labels */}
      <div className="flex items-center justify-between mb-3 text-xs font-semibold text-muted-foreground">
        <span className="text-primary font-bold uppercase tracking-wider">
          Step {currentStep} of 5
        </span>
        <span>{STEPS[currentStep - 1]?.title || "Onboarding"}</span>
      </div>

      {/* Step nodes & connectors */}
      <div className="relative flex items-center justify-between">
        {/* Continuous background track */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-muted -z-0 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{
              width: `${Math.max(0, Math.min(100, ((currentStep - 1) / (STEPS.length - 1)) * 100))}%`,
            }}
          />
        </div>

        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <div key={s.step} className="flex flex-col items-center z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-xs",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-card border-2 border-primary text-primary ring-4 ring-primary/15"
                    : "bg-card border border-border text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>{s.step}</span>
                )}
              </div>
              <span
                className={cn(
                  "hidden sm:block text-[11px] font-medium mt-1.5 transition-colors",
                  isCurrent
                    ? "text-primary font-semibold"
                    : isCompleted
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {s.shortTitle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
