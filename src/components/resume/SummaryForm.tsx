import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Loader2 } from "lucide-react";
import { useAiSuggestion } from "@/hooks/useAiSuggestion";
import { toast } from "sonner";

interface SummaryFormProps {
  data: string;
  onChange: (data: string) => void;
}

export const SummaryForm = ({ data, onChange }: SummaryFormProps) => {
  const { getSuggestion, isLoading } = useAiSuggestion();

  const handleAiEnhance = async () => {
    const suggestion = await getSuggestion("summary", {
      currentText: data || undefined,
    });

    if (suggestion) {
      onChange(suggestion);
      toast.success("Summary enhanced with AI!");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="summary" className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Professional Summary
        </Label>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={handleAiEnhance}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isLoading ? "Generating..." : "AI Enhance"}
        </Button>
      </div>
      
      <Textarea
        id="summary"
        placeholder="Write a compelling 2-3 sentence summary highlighting your experience, skills, and career goals..."
        value={data}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] resize-none"
      />
      
      <p className="text-xs text-muted-foreground">
        Tip: Click "AI Enhance" to generate or improve your summary. The AI will create an ATS-friendly version.
      </p>
    </div>
  );
};
