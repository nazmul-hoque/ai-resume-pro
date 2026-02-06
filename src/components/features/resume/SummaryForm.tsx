import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { MarkdownEditor } from "@/components/shared/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useAiSuggestion } from "@/hooks/useAiSuggestion";
import { AiEnhanceButton } from "@/components/shared/AiEnhanceButton";
import { toast } from "sonner";
import { ResumeData } from "@/types/resume";

import { aiService } from "@/services/ai.service";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import React, { useState } from "react";

export const SummaryForm = () => {
  const { control, getValues, setValue } = useFormContext<ResumeData>();
  const { getSuggestion, isLoading } = useAiSuggestion();
  const [isImproving, setIsImproving] = useState(false);

  const handleImprove = async () => {
    const currentSummary = getValues("summary");
    if (!currentSummary) return;

    setIsImproving(true);
    try {
      const result = await aiService.improveSection(currentSummary, "Professional Summary");
      if (result?.improvedText) {
        setValue("summary", result.improvedText, { shouldDirty: true });
        toast.success("Summary polished by AI!");
      }
    } catch (error) {
      toast.error("Failed to improve summary.");
      console.error(error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleAiEnhance = async () => {
    const currentSummary = getValues("summary");
    const suggestion = await getSuggestion("summary", {
      currentText: currentSummary || undefined,
    });

    if (suggestion) {
      setValue("summary", suggestion, { shouldDirty: true });
      toast.success("Summary enhanced with AI!");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Professional Summary
        </FormLabel>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImprove}
            disabled={isImproving}
            className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            type="button"
          >
            {isImproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Fix It For Me
          </Button>
          <AiEnhanceButton
            onClick={handleAiEnhance}
            isLoading={isLoading}
          />
        </div>
      </div>

      <FormField
        control={control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <MarkdownEditor
                placeholder="Write a compelling 2-3 sentence summary highlighting your experience, skills, and career goals..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <p className="text-xs text-muted-foreground">
        Tip: Click "AI Enhance" to generate or improve your summary. The AI will create an ATS-friendly version.
      </p>
    </div>
  );
};
