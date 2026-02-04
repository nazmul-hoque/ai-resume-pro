import { Skill } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAiSuggestion } from "@/hooks/useAiSuggestion";
import { toast } from "sonner";

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const skillLevelColors = {
  beginner: "bg-muted text-muted-foreground",
  intermediate: "bg-secondary text-secondary-foreground",
  advanced: "bg-primary/20 text-primary",
  expert: "gradient-bg text-primary-foreground",
};

export const SkillsForm = ({ data, onChange }: SkillsFormProps) => {
  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState<Skill["level"]>("intermediate");
  const { getSuggestion, isLoading } = useAiSuggestion();

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const skill: Skill = {
      id: crypto.randomUUID(),
      name: newSkill.trim(),
      level: newLevel,
    };
    onChange([...data, skill]);
    setNewSkill("");
  };

  const removeSkill = (id: string) => {
    onChange(data.filter((skill) => skill.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleAiSuggest = async () => {
    const suggestion = await getSuggestion("skills", {
      skills: data.map(s => s.name),
    });

    if (suggestion) {
      const suggestedSkills = suggestion
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0 && !data.some(existing => 
          existing.name.toLowerCase() === s.toLowerCase()
        ));

      const newSkills: Skill[] = suggestedSkills.map(name => ({
        id: crypto.randomUUID(),
        name,
        level: "intermediate" as const,
      }));

      onChange([...data, ...newSkills]);
      toast.success(`Added ${newSkills.length} suggested skills!`);
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
        <Button onClick={addSkill} size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 w-full"
        onClick={handleAiSuggest}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {isLoading ? "Suggesting skills..." : "AI Suggest Skills"}
      </Button>

      {data.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Lightbulb className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No skills added yet</p>
          <p className="text-xs text-muted-foreground">
            Add skills manually or click "AI Suggest Skills" to get recommendations
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {data.map((skill) => (
            <Badge
              key={skill.id}
              variant="secondary"
              className={`${skillLevelColors[skill.level]} px-3 py-1.5 text-sm flex items-center gap-2`}
            >
              {skill.name}
              <span className="text-xs opacity-70 capitalize">• {skill.level}</span>
              <button
                onClick={() => removeSkill(skill.id)}
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
