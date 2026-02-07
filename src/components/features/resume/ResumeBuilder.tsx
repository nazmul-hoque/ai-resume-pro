import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
import { useAutoSave } from "@/hooks/useAutoSave";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ProgressSteps } from "@/components/ui/progress-steps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Cloud,
  CloudOff,
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
import { cn } from "@/lib/utils";

interface SortableSectionProps {
  id: string;
  icon: any;
  title: string;
  component: React.ReactNode;
  isComplete: boolean;
}

const SortableAccordionItem = ({ id, icon: Icon, title, component, isComplete }: SortableSectionProps) => {
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
    <div ref={setNodeRef} style={style} className="mb-4 animate-fade-in">
      <AccordionItem
        value={id}
        className={cn(
          "border rounded-lg px-4 transition-all duration-300",
          "data-[state=open]:bg-muted/30 data-[state=open]:shadow-sm",
          "hover:border-primary/30"
        )}
      >
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab hover:bg-muted p-1 rounded-md transition-colors shrink-0">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <AccordionTrigger className="flex-1 hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg transition-colors duration-300",
                isComplete ? "bg-primary/20" : "bg-primary/10"
              )}>
                <Icon className={cn(
                  "w-4 h-4 transition-colors duration-300",
                  isComplete ? "text-primary" : "text-primary/70"
                )} />
              </div>
              <span className="font-semibold">{title}</span>
              {isComplete && (
                <Check className="w-4 h-4 text-primary animate-scale-in" />
              )}
            </div>
          </AccordionTrigger>
        </div>
        <AccordionContent className="px-1 pt-2 pb-6 animate-fade-in">
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
  const [openSections, setOpenSections] = useState<string[]>(["personal"]);

  const methods = useForm<ResumeData>({
    resolver: zodResolver(ResumeDataSchema),
    defaultValues: initialResume?.data || defaultResumeData,
    mode: "onChange", // Enable real-time validation
  });

  const { watch, handleSubmit, formState: { isDirty, errors }, setValue } = methods;
  const resumeData = watch();

  // Calculate section completion
  const sectionCompletion = useMemo(() => {
    const personal = !!(
      resumeData.personalInfo?.fullName &&
      resumeData.personalInfo?.email
    );
    const summary = !!(resumeData.summary && resumeData.summary.length > 20);
    const experience = resumeData.experience?.length > 0 &&
      resumeData.experience.some(e => e.company && e.position);
    const education = resumeData.education?.length > 0 &&
      resumeData.education.some(e => e.institution && e.degree);
    const skills = resumeData.skills?.length >= 3;

    return { personal, summary, experience, education, skills };
  }, [resumeData]);

  const progressSteps = useMemo(() => [
    { id: "personal", label: "Personal", isComplete: sectionCompletion.personal, isActive: openSections.includes("personal") },
    { id: "summary", label: "Summary", isComplete: sectionCompletion.summary, isActive: openSections.includes("summary") },
    { id: "experience", label: "Experience", isComplete: sectionCompletion.experience, isActive: openSections.includes("experience") },
    { id: "education", label: "Education", isComplete: sectionCompletion.education, isActive: openSections.includes("education") },
    { id: "skills", label: "Skills", isComplete: sectionCompletion.skills, isActive: openSections.includes("skills") },
  ], [sectionCompletion, openSections]);

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

  // Track changes
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

  // Auto-save functionality
  const autoSaveHandler = useCallback(async () => {
    if (!user) return;
    const data = methods.getValues();
    await onSave(data);
  }, [user, methods, onSave]);

  useAutoSave({
    onSave: autoSaveHandler,
    delay: 30000, // 30 seconds
    enabled: !!user && !!resumeId,
    hasChanges: hasUnsavedChanges,
  });

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
    personal: { icon: User, title: "Personal Information", component: <PersonalInfoForm />, isComplete: sectionCompletion.personal },
    summary: { icon: FileText, title: "Professional Summary", component: <SummaryForm />, isComplete: sectionCompletion.summary },
    experience: { icon: Briefcase, title: "Work Experience", component: <ExperienceForm />, isComplete: sectionCompletion.experience },
    education: { icon: GraduationCap, title: "Education", component: <EducationForm />, isComplete: sectionCompletion.education },
    skills: { icon: Lightbulb, title: "Skills", component: <SkillsForm />, isComplete: sectionCompletion.skills },
  };

  const currentOrder = resumeData.sectionOrder || defaultResumeData.sectionOrder || [];

  return (
    <FormProvider {...methods}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-card/60 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
              {/* Left: Navigation & Title */}
              <div className="flex items-center gap-3 lg:gap-6 min-w-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="h-9 w-9 p-0 rounded-full hover:bg-primary/10 transition-colors shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="sr-only">Back</span>
                </Button>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 group">
                    <Input
                      value={resumeTitle}
                      onChange={(e) => setResumeTitle(e.target.value)}
                      className="font-display font-bold text-base md:text-lg border-0 bg-transparent p-0 h-auto focus-visible:ring-0 w-full max-w-[150px] md:max-w-[240px] truncate group-hover:text-primary transition-colors"
                      placeholder="Resume title"
                    />
                    <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Save status integrated below title */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 cursor-help">
                          {isSaving ? (
                            <div className="flex items-center gap-1.5">
                              <Loader2 className="w-3 h-3 animate-spin text-primary" />
                              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Syncing...</span>
                            </div>
                          ) : hasUnsavedChanges ? (
                            <div className="flex items-center gap-1.5">
                              <CloudOff className="w-3 h-3 text-amber-500" />
                              <span className="text-[10px] text-amber-500 font-medium uppercase tracking-wider">Unsaved Changes</span>
                            </div>
                          ) : lastSaved ? (
                            <div className="flex items-center gap-1.5">
                              <Cloud className="w-3 h-3 text-primary" />
                              <span className="text-[10px] text-primary/80 font-medium uppercase tracking-wider">Saved to Cloud</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Draft</span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="start">
                        {isSaving ? "Synchronizing with your account..." : hasUnsavedChanges ? "Changes not yet saved" : lastSaved ? `Last saved at ${lastSaved.toLocaleTimeString()}` : "Ready to save"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Center: AI Catalyst Toolkit (Hidden on Mobile) */}
              <div className="hidden xl:flex items-center bg-muted/30 p-1 rounded-xl border border-white/5 shadow-inner">
                <div className="flex items-center gap-0.5">
                  <ImportResume />
                  <div className="w-[1px] h-6 bg-white/10 mx-1" />
                  <CoverLetterGenerator />
                  <TemplateStrategy resumeData={resumeData} />
                  <JobTargeting />
                  <RecruiterReview resumeData={resumeData} />
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "hidden sm:flex h-9 gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all",
                      !hasUnsavedChanges && "opacity-50 grayscale"
                    )}
                    onClick={handleSave}
                    disabled={isSaving || !hasUnsavedChanges}
                  >
                    {isSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span className="text-xs font-semibold">Save</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="xl:hidden h-9 w-9 p-0 rounded-full"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>

                <Button
                  variant="hero"
                  size="sm"
                  className="h-9 px-4 lg:px-6 gap-2 rounded-full shadow-lg shadow-primary/20 ring-1 ring-white/20"
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span className="text-xs font-bold tracking-tight uppercase">Download</span>
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
                  {/* Progress indicator */}
                  <div className="p-4 border-b">
                    <ProgressSteps steps={progressSteps} />
                  </div>

                  <ScrollArea className="h-[calc(100vh-260px)]">
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
                          <Accordion
                            type="multiple"
                            value={openSections}
                            onValueChange={setOpenSections}
                            className="space-y-4"
                          >
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
                                  isComplete={config.isComplete}
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
                    <div ref={previewRef} className="animate-fade-in">
                      <ResumePreview data={resumeData} template={selectedTemplate} />
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            </div>
          </div>

          {/* Mobile action bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t z-40">
            <div className="flex items-center justify-around gap-2">
              <ImportResume />
              <CoverLetterGenerator />
              <JobTargeting />
              <RecruiterReview resumeData={resumeData} />
            </div>
          </div>
        </div>
      </TooltipProvider>
    </FormProvider>
  );
};
