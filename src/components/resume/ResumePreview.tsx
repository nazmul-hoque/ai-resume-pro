import { ResumeData } from "@/types/resume";
import { TemplateId, ModernTemplate, ClassicTemplate, CreativeTemplate } from "./templates";

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
