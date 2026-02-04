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

const getSkillColor = (level: string) => {
  switch (level) {
    case 'expert': return 'bg-primary text-primary-foreground';
    case 'advanced': return 'bg-accent text-accent-foreground';
    case 'intermediate': return 'bg-secondary text-secondary-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const CreativeTemplate = ({ data }: TemplateProps) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="bg-card text-card-foreground min-h-full font-sans text-sm">
      {/* Header - Colorful Banner */}
      <header className="gradient-bg text-primary-foreground p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-90">
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

      <div className="px-6 pb-6">
        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 gradient-bg rounded-full"></div>
              <h2 className="text-sm font-bold text-foreground">About Me</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed pl-3 border-l-2 border-muted">
              {summary}
            </p>
          </section>
        )}

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
                        <h3 className="font-semibold text-foreground">{exp.position}</h3>
                        <p className="text-primary text-xs font-medium">
                          {exp.company}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-muted-foreground text-xs mt-2 whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
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
              {education.map((edu) => (
                <div 
                  key={edu.id} 
                  className="p-3 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground text-xs">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-muted-foreground text-xs">{edu.institution}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-xs text-primary mt-1 font-medium">GPA: {edu.gpa}</p>
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
