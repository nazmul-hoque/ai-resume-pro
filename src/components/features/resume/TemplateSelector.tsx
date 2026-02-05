import React from "react";
import { templates, TemplateId } from "./templates";
import { cn } from "@/lib/utils";
import { Check, Layout, FileText, Sparkles } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (template: TemplateId) => void;
}

const templateIcons: Record<TemplateId, React.ReactNode> = {
  modern: <Layout className="w-4 h-4" />,
  classic: <FileText className="w-4 h-4" />,
  creative: <Sparkles className="w-4 h-4" />,
};

export const TemplateSelector = ({
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) => {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelectTemplate(template.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
            selectedTemplate === template.id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          )}
          title={template.description}
        >
          {templateIcons[template.id]}
          <span className="hidden sm:inline">{template.name}</span>
          {selectedTemplate === template.id && (
            <Check className="w-3 h-3 text-primary" />
          )}
        </button>
      ))}
    </div>
  );
};
