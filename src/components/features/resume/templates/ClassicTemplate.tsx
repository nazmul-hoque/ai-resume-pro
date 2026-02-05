import { ResumeData } from "@/types/resume";

interface TemplateProps {
  data: ResumeData;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";

export const ClassicTemplate = ({ data }: TemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="text-card-foreground font-serif text-sm w-full max-w-full">
      {/* Header - Centered Classic Style */}
      <header className="text-center border-b border-border pb-6 mb-6">
        <h1 className="text-3xl font-bold text-foreground tracking-wide mb-3">
          {personalInfo.fullName?.toUpperCase() || "YOUR NAME"}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {(personalInfo.linkedin || personalInfo.website) && (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.linkedin && personalInfo.website && <span>|</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        )}
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-1 mb-3 tracking-wider">
            PROFESSIONAL SUMMARY
          </h2>
          <MarkdownRenderer content={summary} className="text-muted-foreground text-justify" />
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-1 mb-3 tracking-wider">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-foreground">{exp.position}</h3>
                  <span className="text-xs text-muted-foreground italic">
                    {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-muted-foreground italic mb-2">
                  {exp.company}{exp.location && `, ${exp.location}`}
                </p>
                {exp.description && (
                  <MarkdownRenderer content={exp.description} className="text-muted-foreground text-xs leading-relaxed" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-1 mb-3 tracking-wider">
            EDUCATION
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-foreground">
                    {edu.degree}{edu.field && `, ${edu.field}`}
                  </h3>
                  <span className="text-xs text-muted-foreground italic">
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-muted-foreground italic">{edu.institution}</p>
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
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-1 mb-3 tracking-wider">
            SKILLS
          </h2>
          <p className="text-muted-foreground text-xs">
            {skills.map((skill) => skill.name).join(" • ")}
          </p>
        </section>
      )}
    </div>
  );
};
