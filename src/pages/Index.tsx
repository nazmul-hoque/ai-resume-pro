import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/features/landing/Hero";
import { ResumeBuilder } from "@/components/features/resume/ResumeBuilder";
import { SavedResumes } from "@/components/features/resume/SavedResumes";
import { useAuth } from "@/contexts/AuthContext";
import { Resume } from "@/hooks/useResumes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { TemplatesGallery } from "@/components/features/landing/TemplatesGallery";
import { TemplateId } from "@/components/features/resume/templates";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showBuilder, setShowBuilder] = useState(false);
  const [showSavedResumes, setShowSavedResumes] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | undefined>();

  const handleGetStarted = () => {
    if (user) {
      setShowSavedResumes(true);
    } else {
      navigate("/auth");
    }
  };

  const handleSelectTemplate = (templateId: TemplateId) => {
    if (user) {
      setSelectedTemplate(templateId);
      setSelectedResume(null);
      setShowBuilder(true);
      setShowSavedResumes(false);
    } else {
      // Store preference for after login if desired, or just redirect
      navigate("/auth");
    }
  };

  const handleSelectResume = (resume: Resume) => {
    setSelectedResume(resume);
    setSelectedTemplate(undefined); // Use template from resume
    setShowBuilder(true);
    setShowSavedResumes(false);
  };

  const handleCreateNew = () => {
    setSelectedResume(null);
    setSelectedTemplate(undefined);
    setShowBuilder(true);
    setShowSavedResumes(false);
  };

  const handleBack = () => {
    if (showBuilder) {
      setShowBuilder(false);
      if (user) {
        setShowSavedResumes(true);
      }
    } else {
      setShowSavedResumes(false);
    }
    setSelectedResume(null);
    setSelectedTemplate(undefined);
  };

  const handleViewTemplates = () => {
    const element = document.getElementById("templates-gallery");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (showBuilder) {
    return (
      <ResumeBuilder
        onBack={handleBack}
        initialResume={selectedResume}
        initialTemplate={selectedTemplate}
      />
    );
  }

  if (showSavedResumes && user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="font-display font-bold text-xl">My Resumes</h1>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="p-6">
            <SavedResumes onSelectResume={handleSelectResume} onCreateNew={handleCreateNew} />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={handleGetStarted} onViewTemplates={handleViewTemplates} />
      <TemplatesGallery onSelectTemplate={handleSelectTemplate} />
    </div>
  );
};

export default Index;
