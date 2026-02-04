import { useState, useRef } from "react";
import { ResumeData, defaultResumeData } from "@/types/resume";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { SummaryForm } from "./SummaryForm";
import { ExperienceForm } from "./ExperienceForm";
import { EducationForm } from "./EducationForm";
import { SkillsForm } from "./SkillsForm";
import { ResumePreview } from "./ResumePreview";
import { TemplateSelector } from "./TemplateSelector";
import { TemplateId } from "./templates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePdfExport } from "@/hooks/usePdfExport";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Download,
  ArrowLeft,
  Eye,
  Edit3,
  Loader2,
} from "lucide-react";

interface ResumeBuilderProps {
  onBack: () => void;
}

export const ResumeBuilder = ({ onBack }: ResumeBuilderProps) => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("modern");
  const previewRef = useRef<HTMLDivElement>(null);
  
  const { exportToPdf, isExporting } = usePdfExport({
    filename: resumeData.personalInfo.fullName 
      ? `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume`
      : "Resume"
  });

  const handleDownloadPdf = () => {
    exportToPdf(previewRef);
  };

  const sections = [
    {
      id: "personal",
      icon: User,
      title: "Personal Information",
      component: (
        <PersonalInfoForm
          data={resumeData.personalInfo}
          onChange={(data) => setResumeData({ ...resumeData, personalInfo: data })}
        />
      ),
    },
    {
      id: "summary",
      icon: FileText,
      title: "Professional Summary",
      component: (
        <SummaryForm
          data={resumeData.summary}
          onChange={(data) => setResumeData({ ...resumeData, summary: data })}
        />
      ),
    },
    {
      id: "experience",
      icon: Briefcase,
      title: "Work Experience",
      component: (
        <ExperienceForm
          data={resumeData.experience}
          onChange={(data) => setResumeData({ ...resumeData, experience: data })}
        />
      ),
    },
    {
      id: "education",
      icon: GraduationCap,
      title: "Education",
      component: (
        <EducationForm
          data={resumeData.education}
          onChange={(data) => setResumeData({ ...resumeData, education: data })}
        />
      ),
    },
    {
      id: "skills",
      icon: Lightbulb,
      title: "Skills",
      component: (
        <SkillsForm
          data={resumeData.skills}
          onChange={(data) => setResumeData({ ...resumeData, skills: data })}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="font-display font-bold text-xl">Resume Builder</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="md:hidden gap-2"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? (
                <>
                  <Edit3 className="w-4 h-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Preview
                </>
              )}
            </Button>
            <Button 
              variant="hero" 
              size="sm" 
              className="gap-2"
              onClick={handleDownloadPdf}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? "Exporting..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className={`${showPreview ? "hidden md:block" : ""}`}>
            <Card className="card-shadow">
              <ScrollArea className="h-[calc(100vh-160px)]">
                <div className="p-6">
                  <Accordion type="multiple" defaultValue={["personal"]} className="space-y-4">
                    {sections.map((section) => (
                      <AccordionItem
                        key={section.id}
                        value={section.id}
                        className="border rounded-lg px-4 data-[state=open]:bg-muted/30"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <section.icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-semibold">{section.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-6">
                          {section.component}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className={`${!showPreview ? "hidden md:block" : ""}`}>
            <Card className="card-shadow sticky top-24 overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 border-b flex items-center justify-between">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={setSelectedTemplate}
                />
                <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground">
                  ATS-Friendly
                </span>
              </div>
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div ref={previewRef}>
                  <ResumePreview data={resumeData} template={selectedTemplate} />
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
