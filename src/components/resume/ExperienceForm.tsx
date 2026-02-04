import { Experience } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Briefcase, Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAiSuggestion } from "@/hooks/useAiSuggestion";
import { toast } from "sonner";
import { useState } from "react";

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export const ExperienceForm = ({ data, onChange }: ExperienceFormProps) => {
  const { getSuggestion, isLoading } = useAiSuggestion();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onChange([...data, newExp]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    onChange(
      data.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const handleAiImprove = async (exp: Experience) => {
    setLoadingId(exp.id);
    
    const suggestion = await getSuggestion("experience", {
      currentText: exp.description || undefined,
      jobTitle: exp.position || undefined,
      company: exp.company || undefined,
    });

    if (suggestion) {
      updateExperience(exp.id, "description", suggestion);
      toast.success("Description improved with AI!");
    }
    
    setLoadingId(null);
  };

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No work experience added yet</p>
          <Button variant="outline" onClick={addExperience} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        </div>
      ) : (
        <>
          {data.map((exp, index) => (
            <Card key={exp.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Experience {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    placeholder="Job Title"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="City, Country"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onCheckedChange={(checked) => updateExperience(exp.id, "current", checked as boolean)}
                    />
                    <Label htmlFor={`current-${exp.id}`} className="text-sm cursor-pointer">
                      I currently work here
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Description</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-xs"
                    onClick={() => handleAiImprove(exp)}
                    disabled={isLoading && loadingId === exp.id}
                  >
                    {isLoading && loadingId === exp.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    {isLoading && loadingId === exp.id ? "Improving..." : "AI Improve"}
                  </Button>
                </div>
                <Textarea
                  placeholder="Describe your responsibilities and achievements. Use bullet points for better readability..."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </Card>
          ))}

          <Button variant="outline" onClick={addExperience} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Add Another Experience
          </Button>
        </>
      )}
    </div>
  );
};
