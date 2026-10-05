"use client";

import { cn } from "@/lib/utils";

export interface Step {
  id: number;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const Stepper = ({ steps, currentStep, className }: StepperProps) => {
  return (
    <div className={cn("w-full mb-12", className)}>
      <div className="flex justify-between items-start relative">
        {steps.map((s, index) => (
          <div
            key={s.id}
            className="relative flex flex-col items-center gap-2 flex-1 group cursor-default"
          >
            {/* Step Circle */}
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 border-2 bg-background relative z-10",
                currentStep === s.id
                  ? "border-primary bg-primary text-white dark:text-black shadow-md shadow-primary/25 scale-110"
                  : s.id < currentStep
                  ? "border-primary bg-primary text-white dark:text-black"
                  : "border-slate-200 text-slate-400 dark:border-border dark:text-muted-foreground"
              )}
            >
              {s.id < currentStep ? (
                <span className="material-symbols-outlined text-sm font-bold">check</span>
              ) : (
                s.id
              )}
            </div>

            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-4 left-[50%] w-full h-[2px] transition-all duration-500",
                  s.id < currentStep ? "bg-primary" : "bg-slate-200 dark:bg-border"
                )}
                style={{ zIndex: 0 }}
              />
            )}

            {/* Labels */}
            <div className="text-center absolute top-10 w-32">
              <div
                className={cn(
                  "text-xs font-semibold transition-colors duration-300",
                  currentStep === s.id
                    ? "text-primary"
                    : s.id < currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
