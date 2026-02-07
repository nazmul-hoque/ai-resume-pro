import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { aiService } from '@/services/ai.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertTriangle, XCircle, Target, Flame, FileText, ScanSearch } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecruiterReviewProps {
    resumeData: ResumeData;
    jobDescription?: string;
}

interface ReviewResult {
    impression: string;
    decision: "Strong Yes" | "Maybe" | "No";
    decisionReason: string;
    heatmap: {
        high: string[];
        medium: string[];
        ignored: string[];
    };
    redFlags: string[];
    atsCheck: {
        passed: boolean;
        issues: string[];
    };
    fixes: string[];
    score: number;
    scoreReason: string;
}

export const RecruiterReview: React.FC<RecruiterReviewProps> = ({ resumeData, jobDescription }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ReviewResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRunReview = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await aiService.recruiterReview(resumeData, jobDescription);
            if (data) {
                setResult(data);
            } else {
                setError("No analysis returned. Please try again.");
            }
        } catch (err) {
            setError("Failed to generate recruiter review. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getDecisionBadge = (decision: string) => {
        switch (decision) {
            case "Strong Yes":
                return <Badge className="bg-green-600 hover:bg-green-700">✅ Strong Yes</Badge>;
            case "Maybe":
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">⚠️ Maybe</Badge>;
            case "No":
                return <Badge className="bg-red-600 hover:bg-red-700">❌ No</Badge>;
            default:
                return <Badge variant="outline">{decision}</Badge>;
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 transition-colors">
                    <ScanSearch className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Scan</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md md:max-w-xl w-full">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ScanSearch className="h-5 w-5 text-primary" />
                        Recruiter Persona Scan
                    </SheetTitle>
                    <SheetDescription>
                        Get a brutal, honest 6-second scan from an AI recruiter.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 h-full">
                    {!result ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <ScanSearch className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                Check heatmaps, red flags, and get a hire/no-hire decision in seconds.
                            </p>
                            <Button
                                onClick={handleRunReview}
                                disabled={isLoading}
                                size="lg"
                                className="w-full max-w-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Scanning Resume...
                                    </>
                                ) : (
                                    "Start Recruiter Scan"
                                )}
                            </Button>
                            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                        </div>
                    ) : (
                        <ScrollArea className="h-[calc(100vh-140px)] pr-4">
                            <div className="space-y-6 pb-8">
                                {/* Header Score */}
                                <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Confidence Score</p>
                                        <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                                            {result.score}/100
                                        </div>
                                    </div>
                                    {getDecisionBadge(result.decision)}
                                </div>

                                {/* 1. Impression */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">First Impression</h3>
                                    <p className="font-medium text-foreground">{result.decisionReason}</p>
                                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md text-sm italic text-blue-800 dark:text-blue-200 border-l-2 border-blue-500">
                                        "{result.impression}"
                                    </div>
                                </div>

                                {/* 2. Top Fixes */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2 text-foreground">
                                        <Target className="h-4 w-4 text-blue-500" />
                                        Top 5 Fixes
                                    </h3>
                                    <div className="space-y-2">
                                        {result.fixes.map((fix, idx) => (
                                            <div key={idx} className="flex items-start gap-3 bg-secondary/50 p-2.5 rounded-md text-sm">
                                                <span className="bg-background shadow-sm text-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 border">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-foreground/90">{fix}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Heatmap */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2 text-foreground">
                                        <Flame className="h-4 w-4 text-orange-500" />
                                        Attention Heatmap
                                    </h3>
                                    <div className="grid gap-3 text-sm">
                                        <div className="flex flex-col gap-1 p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50">
                                            <div className="flex items-center gap-2 font-medium text-red-700 dark:text-red-400">
                                                <Flame className="h-3.5 w-3.5" /> High Attention
                                            </div>
                                            <span className="text-red-600/90 dark:text-red-300/90">{result.heatmap.high.join(', ') || "None"}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 p-3 rounded-md bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/50">
                                            <div className="flex items-center gap-2 font-medium text-yellow-700 dark:text-yellow-400">
                                                <ScanSearch className="h-3.5 w-3.5" /> Skimmed
                                            </div>
                                            <span className="text-yellow-600/90 dark:text-yellow-300/90">{result.heatmap.medium.join(', ') || "None"}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 p-3 rounded-md bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-400">
                                                <ScanSearch className="h-3.5 w-3.5 opacity-50" /> Ignored
                                            </div>
                                            <span className="text-gray-600/90 dark:text-gray-500">{result.heatmap.ignored.join(', ') || "None"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Red Flags */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2 text-foreground">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        Red Flags & Friction
                                    </h3>
                                    {result.redFlags.length > 0 ? (
                                        <ul className="space-y-2">
                                            {result.redFlags.map((flag, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                                                    <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                                    {flag}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-green-600 flex items-center gap-2 font-medium bg-green-50 dark:bg-green-950/30 p-2 rounded">
                                            <CheckCircle className="h-4 w-4" /> No major red flags detected.
                                        </p>
                                    )}
                                </div>

                                {/* 5. ATS Reality Check */}
                                <div className="rounded-lg border bg-card p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold flex items-center gap-2 text-sm">
                                            <FileText className="h-4 w-4 text-primary" />
                                            ATS Compatibility
                                        </h3>
                                        {result.atsCheck.passed ? (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">ATS Passed</Badge>
                                        ) : (
                                            <Badge variant="destructive">ATS Risk</Badge>
                                        )}
                                    </div>
                                    {result.atsCheck.issues.length > 0 ? (
                                        <ul className="space-y-1.5">
                                            {result.atsCheck.issues.map((issue, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                                                    {issue}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Resume format appears to be ATS-friendly.</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t">
                                    <Button variant="outline" className="w-full" onClick={handleRunReview}>
                                        Run New Scan
                                    </Button>
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};
