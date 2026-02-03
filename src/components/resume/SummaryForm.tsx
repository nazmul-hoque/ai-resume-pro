import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText } from "lucide-react";

interface SummaryFormProps {
  data: string;
  onChange: (data: string) => void;
}

export const SummaryForm = ({ data, onChange }: SummaryFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="summary" className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Professional Summary
        </Label>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="w-4 h-4" />
          AI Enhance
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
        Tip: Keep your summary concise and tailored to the job you're applying for. Focus on your unique value proposition.
      </p>
    </div>
  );
};
