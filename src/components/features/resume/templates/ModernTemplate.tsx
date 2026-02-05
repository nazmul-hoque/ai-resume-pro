import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";

export const ModernTemplate = ({ data }: TemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="text-card-foreground font-sans text-sm w-full max-w-full">
      {/* Header */}
      <header className="border-b-2 border-foreground pb-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {personalInfo.website}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-2">
            Professional Summary
          </h2>
          <MarkdownRenderer content={summary} className="text-muted-foreground" />
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-foreground">{exp.position}</h3>
                    <p className="text-muted-foreground">
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <MarkdownRenderer content={exp.description} className="text-muted-foreground text-xs mt-1" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-muted-foreground">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.gpa && (
                  <p className="text-xs text-muted-foreground mt-1">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
