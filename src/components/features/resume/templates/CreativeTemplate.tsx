import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { EditableField } from "@/components/shared/EditableField";

interface TemplateProps {
  data: ResumeData;
  readOnly?: boolean;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const getSkillColor = (level: string) => {
  switch (level) {
    case 'expert': return 'bg-primary text-primary-foreground';
    case 'advanced': return 'bg-accent text-accent-foreground';
    case 'intermediate': return 'bg-secondary text-secondary-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const CreativeTemplate = ({ data, readOnly = false }: TemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="text-card-foreground font-sans text-sm h-full w-full max-w-full">
      {/* Header - Colorful Banner */}
      <header className="gradient-bg text-primary-foreground p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">
          <EditableField
            name="personalInfo.fullName"
            value={personalInfo.fullName}
            placeholder="Your Name"
            className="hover:bg-white/10"
            readOnly={readOnly}
          />
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-90">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <EditableField name="personalInfo.email" value={personalInfo.email} className="hover:bg-white/10" readOnly={readOnly} />
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <EditableField name="personalInfo.phone" value={personalInfo.phone} className="hover:bg-white/10" readOnly={readOnly} />
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <EditableField name="personalInfo.location" value={personalInfo.location} className="hover:bg-white/10" readOnly={readOnly} />
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              <EditableField name="personalInfo.linkedin" value={personalInfo.linkedin} className="hover:bg-white/10" readOnly={readOnly} />
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <EditableField name="personalInfo.website" value={personalInfo.website} className="hover:bg-white/10" readOnly={readOnly} />
            </span>
          )}
        </div>
      </header>

      <div className="px-6 pb-6">
        {/* Summary */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 gradient-bg rounded-full"></div>
            <h2 className="text-sm font-bold text-foreground">About Me</h2>
          </div>
          <div className="pl-3 border-l-2 border-muted">
            <EditableField
              name="summary"
              value={summary || ""}
              type="textarea"
              multiline
              renderValue={(val) => <MarkdownRenderer content={val} className="text-muted-foreground" />}
              readOnly={readOnly}
            />
          </div>
        </section>

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 gradient-bg rounded-full"></div>
              <h2 className="text-sm font-bold text-foreground">Experience</h2>
            </div>
            <div className="space-y-4 pl-3">
              {experience.map((exp, index) => (
                <div key={exp.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-3 top-1.5 w-2 h-2 rounded-full bg-primary"></div>
                  {index !== experience.length - 1 && (
                    <div className="absolute -left-[7px] top-4 w-0.5 h-full bg-muted"></div>
                  )}
                  <div className="pl-4">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          <EditableField name={`experience.${index}.position`} value={exp.position} readOnly={readOnly} />
                        </h3>
                        <p className="text-primary text-xs font-medium flex items-center gap-1">
                          <EditableField name={`experience.${index}.company`} value={exp.company} readOnly={readOnly} />
                          {exp.location && (
                            <>
                              <span>•</span>
                              <EditableField name={`experience.${index}.location`} value={exp.location} readOnly={readOnly} />
                            </>
                          )}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground whitespace-nowrap">
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <EditableField
                      name={`experience.${index}.description`}
                      value={exp.description || ""}
                      type="textarea"
                      multiline
                      renderValue={(val) => <MarkdownRenderer content={val} className="text-muted-foreground text-xs mt-1" />}
                      readOnly={readOnly}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 gradient-bg rounded-full"></div>
              <h2 className="text-sm font-bold text-foreground">Education</h2>
            </div>
            <div className="grid gap-3 pl-3">
              {education.map((edu, index) => (
                <div
                  key={edu.id}
                  className="p-3 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-xs flex flex-wrap gap-1">
                        <EditableField name={`education.${index}.degree`} value={edu.degree} readOnly={readOnly} />
                        {edu.field && (
                          <>
                            <span>in</span>
                            <EditableField name={`education.${index}.field`} value={edu.field} readOnly={readOnly} />
                          </>
                        )}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        <EditableField name={`education.${index}.institution`} value={edu.institution} readOnly={readOnly} />
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-xs text-primary mt-1 font-medium flex items-center gap-1">
                      GPA: <EditableField name={`education.${index}.gpa`} value={edu.gpa} readOnly={readOnly} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 gradient-bg rounded-full"></div>
              <h2 className="text-sm font-bold text-foreground">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2 pl-3">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillColor(skill.level)}`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
