import { ResumeData } from "@/types/resume";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { EditableField } from "@/components/shared/EditableField";

interface TemplateProps {
  data: ResumeData;
  readOnly?: boolean;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export const ClassicTemplate = ({ data, readOnly = false }: TemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="text-card-foreground font-serif text-sm w-full max-w-full">
      {/* Header - Centered Classic Style */}
      <header className="text-center border-b border-border pb-6 mb-6">
        <h1 className="text-3xl font-bold text-foreground tracking-wide mb-3 uppercase">
          <EditableField
            name="personalInfo.fullName"
            value={personalInfo.fullName}
            placeholder="YOUR NAME"
            readOnly={readOnly}
          />
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {personalInfo.email && <EditableField name="personalInfo.email" value={personalInfo.email} readOnly={readOnly} />}
          {personalInfo.email && personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <EditableField name="personalInfo.phone" value={personalInfo.phone} readOnly={readOnly} />}
          {personalInfo.phone && personalInfo.location && <span>|</span>}
          {personalInfo.location && <EditableField name="personalInfo.location" value={personalInfo.location} readOnly={readOnly} />}
        </div>
        {(personalInfo.linkedin || personalInfo.website) && (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
            {personalInfo.linkedin && <EditableField name="personalInfo.linkedin" value={personalInfo.linkedin} readOnly={readOnly} />}
            {personalInfo.linkedin && personalInfo.website && <span>|</span>}
            {personalInfo.website && <EditableField name="personalInfo.website" value={personalInfo.website} readOnly={readOnly} />}
          </div>
        )}
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-foreground border-b border-border pb-1 mb-3 tracking-wider uppercase">
          Professional Summary
        </h2>
        <EditableField
          name="summary"
          value={summary || ""}
          type="textarea"
          multiline
          renderValue={(val) => <MarkdownRenderer content={val} className="text-muted-foreground text-justify" />}
          readOnly={readOnly}
        />
      </section>

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-1 mb-3 tracking-wider uppercase">
            Professional Experience
          </h2>
          <div className="space-y-5">
            {experience.map((exp, index) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-foreground">
                    <EditableField name={`experience.${index}.position`} value={exp.position} readOnly={readOnly} />
                  </h3>
                  <span className="text-xs text-muted-foreground italic">
                    {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="text-muted-foreground italic mb-2 flex flex-wrap gap-x-1">
                  <EditableField name={`experience.${index}.company`} value={exp.company} readOnly={readOnly} />
                  {exp.location && (
                    <>
                      <span>,</span>
                      <EditableField name={`experience.${index}.location`} value={exp.location} readOnly={readOnly} />
                    </>
                  )}
                </div>
                <EditableField
                  name={`experience.${index}.description`}
                  value={exp.description || ""}
                  type="textarea"
                  multiline
                  renderValue={(val) => <MarkdownRenderer content={val} className="text-muted-foreground text-xs leading-relaxed" />}
                  readOnly={readOnly}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-1 mb-3 tracking-wider uppercase">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-foreground">
                    <EditableField name={`education.${index}.degree`} value={edu.degree} readOnly={readOnly} />
                    {edu.field && (
                      <>
                        <span>, </span>
                        <EditableField name={`education.${index}.field`} value={edu.field} readOnly={readOnly} />
                      </>
                    )}
                  </h3>
                  <span className="text-xs text-muted-foreground italic">
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-muted-foreground italic">
                  <EditableField name={`education.${index}.institution`} value={edu.institution} readOnly={readOnly} />
                </p>
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
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-1 mb-3 tracking-wider uppercase">
            Skills
          </h2>
          <p className="text-muted-foreground text-xs">
            {skills.map((skill) => skill.name).join(" • ")}
          </p>
        </section>
      )}
    </div>
  );
};
