import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { aiService } from '@/services/ai.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Lightbulb, ListOrdered, CheckCircle, Eye, AlertCircle, LayoutTemplate } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface TemplateStrategyProps {
    resumeData: ResumeData;
    jobDescription?: string;
}

interface StrategyResult {
    template: "Technical" | "Business" | "Executive" | "Academic" | "Creative" | "Fresh Graduate";
    explanation: string;
    scanningLogic: {
        first: string;
        second: string;
        confirm: string;
        stop: string;
    };
    sectionOrder: string[];
    sectionVisibility: {
        prominent: string[];
        deemphasized: string[];
        hidden: string[];
        reasoning: string;
    };
    bulletRules: {
        count: string;
        length: string;
        metrics: string;
    };
    atsSafe: boolean;
    score: number;
    scoreReason: string;
}

export const TemplateStrategy: React.FC<TemplateStrategyProps> = ({ resumeData, jobDescription }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<StrategyResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRunStrategy = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await aiService.getTemplateStrategy(resumeData, jobDescription);
            if (data) {
                setResult(data);
            } else {
                setError("No strategy returned. Please try again.");
            }
        } catch (err) {
            setError("Failed to generate template strategy. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <LayoutTemplate className="w-4 h-4 text-primary" />
                    Template Strategy
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md md:max-w-xl w-full">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <LayoutTemplate className="h-5 w-5 text-primary" />
                        AI Template Strategist
                    </SheetTitle>
                    <SheetDescription>
                        Get expert advice on the best template, structure, and formatting for your target role.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 h-full">
                    {!result ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <Lightbulb className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                Discover the optimal layout and strategy to pass the recruiter's 6-second scan.
                            </p>
                            <Button
                                onClick={handleRunStrategy}
                                disabled={isLoading}
                                size="lg"
                                className="w-full max-w-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing Strategy...
                                    </>
                                ) : (
                                    "Get Strategy Recommendation"
                                )}
                            </Button>
                            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
                        </div>
                    ) : (
                        <ScrollArea className="h-[calc(100vh-140px)] pr-4">
                            <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                {/* Recommendation Header */}
                                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Recommended Template</span>
                                            <h3 className="text-xl font-bold text-foreground">{result.template}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confidence</span>
                                            <div className="text-xl font-bold text-primary">{result.score}/100</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{result.explanation}</p>
                                </div>

                                {/* Section 1: Scanning Logic */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-primary" />
                                        Recruiter Scanning Logic
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <Card className="bg-muted/50 border-none shadow-none">
                                            <CardContent className="p-3">
                                                <span className="text-xs text-muted-foreground uppercase">First Look</span>
                                                <p className="font-medium">{result.scanningLogic.first}</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-muted/50 border-none shadow-none">
                                            <CardContent className="p-3">
                                                <span className="text-xs text-muted-foreground uppercase">Second Look</span>
                                                <p className="font-medium">{result.scanningLogic.second}</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-green-500/10 border-none shadow-none">
                                            <CardContent className="p-3">
                                                <span className="text-xs text-green-700 uppercase">Must Confirm</span>
                                                <p className="font-medium text-green-800">{result.scanningLogic.confirm}</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-red-500/10 border-none shadow-none">
                                            <CardContent className="p-3">
                                                <span className="text-xs text-red-700 uppercase">Deal Breaker</span>
                                                <p className="font-medium text-red-800">{result.scanningLogic.stop}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* Section 2: Optimal Order */}
                                <div>
                                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                                        <ListOrdered className="w-4 h-4 text-primary" />
                                        Optimal Section Order
                                    </h4>
                                    <div className="bg-muted p-4 rounded-lg">
                                        <ol className="list-decimal list-inside space-y-2">
                                            {result.sectionOrder.map((section, i) => (
                                                <li key={i} className="text-sm font-medium pl-2">{section}</li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>

                                {/* Section 3: Visibility Rules */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-primary" />
                                        Visibility Strategy
                                    </h4>
                                    <p className="text-xs text-muted-foreground mb-2">{result.sectionVisibility.reasoning}</p>
                                    <div className="space-y-2">
                                        <div className="flex gap-2 text-sm">
                                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">Prominent</Badge>
                                            <span className="text-muted-foreground">{result.sectionVisibility.prominent.join(", ")}</span>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <Badge variant="secondary">De-emphasized</Badge>
                                            <span className="text-muted-foreground">{result.sectionVisibility.deemphasized.join(", ") || "None"}</span>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <Badge variant="outline" className="text-muted-foreground">Hidden</Badge>
                                            <span className="text-muted-foreground">{result.sectionVisibility.hidden.join(", ") || "None"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Bullet Rules */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-primary" />
                                        Content Rules
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground">Bullets per Role</span>
                                            <span className="font-medium">{result.bulletRules.count}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground">Ideal Length</span>
                                            <span className="font-medium text-right max-w-[200px]">{result.bulletRules.length}</span>
                                        </div>
                                        <div className="flex justify-between pb-2">
                                            <span className="text-muted-foreground">Metrics</span>
                                            <Badge variant="outline">{result.bulletRules.metrics}</Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer: ATS Check */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className="text-sm font-medium text-muted-foreground">ATS Compatibility Check</span>
                                    {result.atsSafe ? (
                                        <Badge className="bg-green-600 hover:bg-green-700">ATS Safe</Badge>
                                    ) : (
                                        <Badge variant="destructive">ATS Risk</Badge>
                                    )}
                                </div>

                                <Button variant="outline" className="w-full mt-4" onClick={handleRunStrategy}>
                                    Regenerate Strategy
                                </Button>
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};
