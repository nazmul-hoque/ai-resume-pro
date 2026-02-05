import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { ResumeData } from "@/types/resume";
import { atsScanner } from "@/lib/atsScanner";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const AtsHealthCheck = () => {
    const { watch } = useFormContext<ResumeData>();
    const resumeData = watch();

    const analysis = useMemo(() => atsScanner.scan(resumeData), [resumeData]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 50) return "text-amber-500";
        return "text-destructive";
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-card border shadow-sm hover:bg-muted transition-colors group">
                    <div className={cn("p-1 rounded-full bg-background", getScoreColor(analysis.score))}>
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start min-w-[100px]">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ATS Score</span>
                            <span className={cn("text-xs font-bold", getScoreColor(analysis.score))}>{analysis.score}%</span>
                        </div>
                        <Progress
                            value={analysis.score}
                            className="h-1 mt-0.5"
                        />
                    </div>
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b bg-muted/30">
                    <h4 className="font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        ATS Optimization Checklist
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                        Real-time checks to ensure your resume is readable by automated systems.
                    </p>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                    {analysis.checks.map((check, i) => (
                        <div key={i} className="flex gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <div className="mt-0.5 shrink-0">
                                {check.passed ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                    <AlertTriangle className={cn("w-4 h-4", check.impact === "high" ? "text-destructive" : "text-amber-500")} />
                                )}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className={cn("text-sm font-medium", !check.passed && "text-foreground")}>
                                    {check.label}
                                </span>
                                {!check.passed && (
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {check.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                    {analysis.score === 100 && (
                        <div className="flex flex-col items-center justify-center py-6 text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </div>
                            <p className="text-sm font-medium">Perfect Score!</p>
                            <p className="text-xs text-muted-foreground mt-1">Your resume is highly optimized for ATS readability.</p>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
