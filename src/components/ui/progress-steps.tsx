import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressStep {
  id: string;
  label: string;
  isComplete: boolean;
  isActive: boolean;
}

interface ProgressStepsProps {
  steps: ProgressStep[];
  className?: string;
}

export const ProgressSteps = ({ steps, className }: ProgressStepsProps) => {
  const completedCount = steps.filter(s => s.isComplete).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Resume Progress</span>
        <span className="text-muted-foreground">{progress}% complete</span>
      </div>
      
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300",
              step.isComplete
                ? "bg-primary/10 text-primary"
                : step.isActive
                ? "bg-accent/10 text-accent-foreground ring-1 ring-accent/30"
                : "bg-muted text-muted-foreground"
            )}
          >
            {step.isComplete && <Check className="w-3 h-3" />}
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
};
