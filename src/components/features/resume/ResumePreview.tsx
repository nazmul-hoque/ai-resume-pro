import { ResumeData } from "@/types/resume";
import { TemplateId, ModernTemplate, ClassicTemplate, CreativeTemplate } from "./templates";
import { Page } from "./Page";

interface ResumePreviewProps {
  data: ResumeData;
  template?: TemplateId;
}

export const ResumePreview = ({ data, template = "modern" }: ResumePreviewProps) => {
  const { personalInfo, summary, experience, education, skills } = data;

  const hasContent =
    personalInfo.fullName ||
    summary ||
    experience.length > 0 ||
    education.length > 0 ||
    skills.length > 0;

  if (!hasContent) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Your resume preview will appear here</p>
          <p className="text-sm">Start filling out the form to see your resume</p>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return <ClassicTemplate data={data} />;
      case "creative":
        return <CreativeTemplate data={data} />;
      case "modern":
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="h-full overflow-auto bg-muted/30 p-2 sm:p-4 custom-scrollbar">
      <div className="bg-white shadow-xl rounded-sm border border-border/50">
        <div className="p-4 sm:p-6">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};
