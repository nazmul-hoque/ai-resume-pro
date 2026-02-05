import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAiSuggestion } from "@/hooks/useAiSuggestion";
import { AiEnhanceButton } from "@/components/shared/AiEnhanceButton";
import { toast } from "sonner";
import { ResumeData, Skill } from "@/types/resume";

const skillLevelColors = {
  beginner: "bg-muted text-muted-foreground",
  intermediate: "bg-secondary text-secondary-foreground",
  advanced: "bg-primary/20 text-primary",
  expert: "gradient-bg text-primary-foreground",
};

export const SkillsForm = () => {
  const { control, getValues } = useFormContext<ResumeData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState<Skill["level"]>("intermediate");
  const { getSuggestion, isLoading } = useAiSuggestion();

  const addSkill = () => {
    if (!newSkill.trim()) return;

    append({
      id: crypto.randomUUID(),
      name: newSkill.trim(),
      level: newLevel,
    });
    setNewSkill("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleAiSuggest = async () => {
    const currentSkills = getValues("skills");
    const suggestion = await getSuggestion("skills", {
      skills: currentSkills.map(s => s.name),
    });

    if (suggestion) {
      const suggestedSkills = suggestion
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0 && !currentSkills.some(existing =>
          existing.name.toLowerCase() === s.toLowerCase()
        ));

      suggestedSkills.forEach(name => {
        append({
          id: crypto.randomUUID(),
          name,
          level: "intermediate" as const,
        });
      });

      toast.success(`Added ${suggestedSkills.length} suggested skills!`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a skill (e.g., JavaScript, Project Management)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Select value={newLevel} onValueChange={(v) => setNewLevel(v as Skill["level"])}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addSkill} size="icon" type="button">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <AiEnhanceButton
        onClick={handleAiSuggest}
        isLoading={isLoading}
        label="Suggest Skills"
        className="w-full"
      />

      {fields.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Lightbulb className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No skills added yet</p>
          <p className="text-xs text-muted-foreground">
            Add skills manually or click "AI Suggest Skills" to get recommendations
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {fields.map((field, index) => (
            <Badge
              key={field.id}
              variant="secondary"
              className={`${skillLevelColors[getValues(`skills.${index}.level`)]} px-3 py-1.5 text-sm flex items-center gap-2`}
            >
              {getValues(`skills.${index}.name`)}
              <span className="text-xs opacity-70 capitalize">• {getValues(`skills.${index}.level`)}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="ml-1 hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Tip: Include both technical skills (programming languages, tools) and soft skills (communication, leadership).
      </p>
    </div>
  );
};
