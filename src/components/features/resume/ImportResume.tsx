import React, { useState, useRef } from "react";
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
import { FileUp, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { pdfParser } from "@/lib/pdfParser";
import { aiService } from "@/services/ai.service";
import { ResumeData } from "@/types/resume";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const ImportResume = () => {
    const [isImporting, setIsImporting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { reset } = useFormContext<ResumeData>();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file.");
            return;
        }

        setIsImporting(true);
        try {
            toast.info("Extracting text from PDF...");
            const rawText = await pdfParser.extractText(file);

            toast.info("AI is parsing your resume structure...");
            const parsedData = await aiService.parseResume(rawText);

            if (parsedData) {
                reset(parsedData);
                toast.success("Resume imported successfully!");
                setIsOpen(false);
            } else {
                throw new Error("AI failed to parse resume data");
            }
        } catch (error) {
            console.error("Import error:", error);
            toast.error("Failed to import resume. Please try another file or enter manually.");
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <FileUp className="w-4 h-4 text-primary" />
                    Import Existing
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Resume Import
                    </DialogTitle>
                    <DialogDescription>
                        Upload your existing PDF resume, and our AI will automatically fill out the forms for you.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Alert variant="default" className="bg-primary/5 border-primary/20">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary font-semibold">Beta Feature</AlertTitle>
                        <AlertDescription className="text-xs text-muted-foreground">
                            AI parsing works best with standard layouts. Please review the imported data for accuracy.
                        </AlertDescription>
                    </Alert>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 space-y-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileChange}
                            disabled={isImporting}
                        />
                        {isImporting ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-sm font-medium animate-pulse text-center">
                                    Processing your resume...<br />
                                    <span className="text-xs text-muted-foreground font-normal">(This may take 10-15 seconds)</span>
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 rounded-full bg-primary/10">
                                    <FileUp className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PDF files only (max 5MB)</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isImporting}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
