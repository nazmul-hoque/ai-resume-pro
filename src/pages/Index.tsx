import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/features/landing/Hero";
import { ResumeBuilder } from "@/components/features/resume/ResumeBuilder";
import { SavedResumes } from "@/components/features/resume/SavedResumes";
import { useAuth } from "@/contexts/AuthContext";
import { Resume } from "@/hooks/useResumes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Briefcase, FileText } from "lucide-react";
import { TemplatesGallery } from "@/components/features/landing/TemplatesGallery";
import { ApplicationDashboard } from "@/components/features/applications/ApplicationDashboard";
import { Footer } from "@/components/features/landing/Footer";
import { TemplateId } from "@/components/features/resume/templates";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showBuilder, setShowBuilder] = useState(false);
  const [showSavedResumes, setShowSavedResumes] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | undefined>();

  const handleGetStarted = () => {
    if (user) {
      setShowSavedResumes(true);
    } else {
      navigate("/signin");
    }
  };

  const handleGoToApplications = () => {
    setShowApplications(true);
    setShowSavedResumes(false);
    setShowBuilder(false);
  };

  const handleSelectTemplate = (templateId: TemplateId) => {
    if (user) {
      setSelectedTemplate(templateId);
      setSelectedResume(null);
      setShowBuilder(true);
      setShowSavedResumes(false);
    } else {
      // Store preference for after login if desired, or just redirect
      navigate("/signin");
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

  if ((showSavedResumes || showApplications) && user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h1 className="font-display font-bold text-xl">
                {showApplications ? "Application Tracker" : "My Resumes"}
              </h1>
            </div>

            {!showApplications && (
              <Button variant="outline" size="sm" onClick={handleGoToApplications} className="gap-2 border-primary text-primary hover:bg-primary/10">
                <Briefcase className="w-4 h-4" />
                Tracked Applications
              </Button>
            )}
            {showApplications && (
              <Button variant="outline" size="sm" onClick={() => { setShowApplications(false); setShowSavedResumes(true); }} className="gap-2">
                <FileText className="w-4 h-4" />
                My Resumes
              </Button>
            )}
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {showApplications ? (
            <ApplicationDashboard />
          ) : (
            <div className="max-w-2xl mx-auto">
              <Card className="p-6">
                <SavedResumes onSelectResume={handleSelectResume} onCreateNew={handleCreateNew} />
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero
        onGetStarted={handleGetStarted}
        onViewTemplates={handleViewTemplates}
        onViewApplications={user ? handleGoToApplications : undefined}
      />
      <TemplatesGallery onSelectTemplate={handleSelectTemplate} />
      <Footer />
    </div>
  );
};

export default Index;
