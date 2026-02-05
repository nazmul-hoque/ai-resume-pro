import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { aiService } from "@/services/ai.service";
import { ResumeData } from "@/types/resume";
import { toast } from "sonner";

export const CoverLetterGenerator = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [jobDescription, setJobDescription] = useState("");
    const [generatedLetter, setGeneratedLetter] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { getValues } = useFormContext<ResumeData>();

    const handleGenerate = async () => {
        if (!jobDescription) {
            toast.error("Please provide a job description first.");
            return;
        }

        setIsGenerating(true);
        try {
            const resumeData = getValues();
            const letter = await aiService.generateCoverLetter(jobDescription, resumeData);

            if (letter) {
                setGeneratedLetter(letter);
                toast.success("Cover letter generated!");
            } else {
                throw new Error("Failed to generate letter");
            }
        } catch (error) {
            console.error("Generation error:", error);
            toast.error("Failed to generate cover letter. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter);
        setIsCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Cover Letter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Cover Letter Generator
                    </DialogTitle>
                    <DialogDescription>
                        Generate a tailored cover letter based on your resume and a job description.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden py-4 space-y-4">
                    {!generatedLetter ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Paste the Job Description</p>
                                <Textarea
                                    placeholder="Paste the requirements, responsibilities, and company details here..."
                                    className="min-h-[300px]"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                            </div>
                            <Button
                                className="w-full gap-2"
                                onClick={handleGenerate}
                                disabled={isGenerating || !jobDescription}
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4" />
                                )}
                                {isGenerating ? "Generating..." : "Generate Professional Letter"}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 h-full flex flex-col">
                            <ScrollArea className="flex-1 rounded-md border p-4 bg-muted/30">
                                <div className="whitespace-pre-wrap text-sm leading-relaxed font-serif">
                                    {generatedLetter}
                                </div>
                            </ScrollArea>
                            <div className="flex justify-between items-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setGeneratedLetter("")}
                                    className="gap-2"
                                >
                                    Start Over
                                </Button>
                                <Button onClick={handleCopy} className="gap-2 flex-1">
                                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {isCopied ? "Copied!" : "Copy to Clipboard"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
