import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResumeData, defaultResumeData, ResumeDataSchema } from "@/types/resume";
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
import { useCreateResume, useUpdateResume, Resume } from "@/hooks/useResumes";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
  Save,
  Check,
  Target,
} from "lucide-react";
import { JobTargeting } from "./JobTargeting";
import { AtsHealthCheck } from "./AtsHealthCheck";
import { ImportResume } from "./ImportResume";
import { TemplateStrategy } from "./TemplateStrategy";
import { RecruiterReview } from "./RecruiterReview";

import { CoverLetterGenerator } from "./CoverLetterGenerator";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableSectionProps {
  id: string;
  icon: any;
  title: string;
  component: React.ReactNode;
}

const SortableAccordionItem = ({ id, icon: Icon, title, component }: SortableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <AccordionItem
        value={id}
        className="border rounded-lg px-4 data-[state=open]:bg-muted/30 relative"
      >
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab hover:bg-muted p-1 rounded-md transition-colors shrink-0">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <AccordionTrigger className="flex-1 hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">{title}</span>
            </div>
          </AccordionTrigger>
        </div>
        <AccordionContent className="pt-2 pb-6">
          {component}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

interface ResumeBuilderProps {
  onBack: () => void;
  initialResume?: Resume | null;
  initialTemplate?: TemplateId;
}

export const ResumeBuilder = ({ onBack, initialResume, initialTemplate }: ResumeBuilderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resumeId, setResumeId] = useState<string | null>(initialResume?.id || null);
  const [resumeTitle, setResumeTitle] = useState(initialResume?.title || "Untitled Resume");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(
    (initialResume?.template as TemplateId) || initialTemplate || "modern"
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const methods = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema),
    defaultValues: initialResume?.data || defaultResumeData,
  });

  const { watch, handleSubmit, formState: { isDirty }, setValue } = methods;
  const resumeData = watch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const order = resumeData.sectionOrder || defaultResumeData.sectionOrder || [];
      const oldIndex = order.indexOf(active.id as any);
      const newIndex = order.indexOf(over?.id as any);

      const newOrder = arrayMove(order, oldIndex, newIndex);
      setValue("sectionOrder", newOrder as any, { shouldDirty: true });
    }
  };

  const createResume = useCreateResume();
  const updateResume = useUpdateResume();

  // Track changes (both internal form changes and external state like title/template)
  useEffect(() => {
    const isActuallyDirty = isDirty ||
      resumeTitle !== (initialResume?.title || "Untitled Resume") ||
      selectedTemplate !== (initialResume?.template || "modern");

    setHasUnsavedChanges(isActuallyDirty);
  }, [isDirty, resumeTitle, selectedTemplate, initialResume]);

  const onSave = useCallback(async (data: ResumeData) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your resume",
        variant: "destructive",
      });
      return;
    }

    if (resumeId) {
      updateResume.mutate(
        { id: resumeId, title: resumeTitle, template: selectedTemplate, data },
        {
          onSuccess: () => {
            setHasUnsavedChanges(false);
            setLastSaved(new Date());
          },
        }
      );
    } else {
      createResume.mutate(
        { title: resumeTitle, template: selectedTemplate, data },
        {
          onSuccess: (newResume) => {
            setResumeId(newResume.id);
            setHasUnsavedChanges(false);
            setLastSaved(new Date());
          },
        }
      );
    }
  }, [user, resumeId, resumeTitle, selectedTemplate, createResume, updateResume, toast]);

  const handleSave = handleSubmit(onSave);

  const isSaving = createResume.isPending || updateResume.isPending;
  const previewRef = useRef<HTMLDivElement>(null);

  const { exportToPdf, isExporting } = usePdfExport({
    filename: resumeData.personalInfo.fullName
      ? `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume`
      : "Resume"
  });

  const handleDownloadPdf = () => {
    exportToPdf(resumeData, selectedTemplate);
  };

  const sectionConfig = {
    personal: { icon: User, title: "Personal Information", component: <PersonalInfoForm /> },
    summary: { icon: FileText, title: "Professional Summary", component: <SummaryForm /> },
    experience: { icon: Briefcase, title: "Work Experience", component: <ExperienceForm /> },
    education: { icon: GraduationCap, title: "Education", component: <EducationForm /> },
    skills: { icon: Lightbulb, title: "Skills", component: <SkillsForm /> },
  };

  const currentOrder = resumeData.sectionOrder || defaultResumeData.sectionOrder || [];

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-background">
        {/* Header code omitted for brevity in this tool call, but I will keep it in the real file */}
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Input
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="font-display font-bold text-xl border-0 bg-transparent p-0 h-auto focus-visible:ring-0 w-48"
                  placeholder="Resume title"
                />
                {lastSaved && !hasUnsavedChanges && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleSave}
                  disabled={isSaving || !hasUnsavedChanges}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              )}
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
              <div className="flex items-center gap-2">
                <ImportResume />
                <CoverLetterGenerator />
                <TemplateStrategy resumeData={resumeData} />
                <JobTargeting />
                <RecruiterReview resumeData={resumeData} />
              </div>
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
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={currentOrder}
                        strategy={verticalListSortingStrategy}
                      >
                        <Accordion type="multiple" defaultValue={["personal"]} className="space-y-4">
                          {currentOrder.map((sectionId) => {
                            const config = sectionConfig[sectionId as keyof typeof sectionConfig];
                            if (!config) return null;
                            return (
                              <SortableAccordionItem
                                key={sectionId}
                                id={sectionId}
                                icon={config.icon}
                                title={config.title}
                                component={config.component}
                              />
                            );
                          })}
                        </Accordion>
                      </SortableContext>
                    </DndContext>
                  </div>
                </ScrollArea>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className={`${!showPreview ? "hidden md:block" : ""}`}>
              <Card className="card-shadow sticky top-24 overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <TemplateSelector
                      selectedTemplate={selectedTemplate}
                      onSelectTemplate={setSelectedTemplate}
                    />
                    <AtsHealthCheck />
                  </div>
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
    </FormProvider>
  );
};
