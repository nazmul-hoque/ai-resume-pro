import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useAiSuggestion } from "@/hooks/useAiSuggestion";
import { AiEnhanceButton } from "@/components/shared/AiEnhanceButton";
import { toast } from "sonner";
import { ResumeData } from "@/types/resume";

export const SummaryForm = () => {
  const { control, getValues, setValue } = useFormContext<ResumeData>();
  const { getSuggestion, isLoading } = useAiSuggestion();

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
        <AiEnhanceButton
          onClick={handleAiEnhance}
          isLoading={isLoading}
        />
      </div>

      <FormField
        control={control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Write a compelling 2-3 sentence summary highlighting your experience, skills, and career goals..."
                {...field}
                className="min-h-[120px] resize-none"
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
