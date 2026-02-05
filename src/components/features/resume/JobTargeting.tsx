import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Target, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { aiService, JobMatchAnalysis } from "@/services/ai.service";
import { ResumeData } from "@/types/resume";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export const JobTargeting = () => {
    const [jobDescription, setJobDescription] = useState("");
    const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { getValues } = useFormContext<ResumeData>();

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            toast.error("Please paste a job description first.");
            return;
        }

        setIsLoading(true);
        try {
            const resumeData = getValues();
            const result = await aiService.analyzeJobMatch(jobDescription, resumeData);
            setAnalysis(result);
            if (result) {
                toast.success("Analysis complete!");
            }
        } catch (error) {
            toast.error("Failed to analyze job match. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Target a Job
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md md:max-w-lg">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        AI Job Match Analysis
                    </SheetTitle>
                    <SheetDescription>
                        Paste a job description to see how well your resume matches and get tailoring suggestions.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Paste the job description here..."
                            className="min-h-[200px] resize-none"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                        <Button
                            className="w-full gap-2"
                            onClick={handleAnalyze}
                            disabled={isLoading || !jobDescription}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            {isLoading ? "Analyzing..." : "Analyze Match"}
                        </Button>
                    </div>

                    {analysis && (
                        <ScrollArea className="h-[calc(100vh-400px)] pr-4">
                            <div className="space-y-6 pb-6">
                                {/* Score Section */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-medium">Match Score</span>
                                        <span className="text-2xl font-bold text-primary">{analysis.matchScore}%</span>
                                    </div>
                                    <Progress value={analysis.matchScore} className="h-2" />
                                </div>

                                {/* Keywords Sections */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            Matching Keywords
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {analysis.matchingKeywords.map((kw, i) => (
                                                <Badge key={i} variant="secondary" className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200">
                                                    {kw}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-amber-500" />
                                            Missing Keywords
                                        </h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {analysis.missingKeywords.map((kw, i) => (
                                                <Badge key={i} variant="secondary" className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-amber-200">
                                                    {kw}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Suggestions Section */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold">Tailoring Suggestions</h4>
                                    <ul className="space-y-2">
                                        {analysis.suggestions.map((sug, i) => (
                                            <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                                <span className="text-primary font-bold">•</span>
                                                {sug}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};
