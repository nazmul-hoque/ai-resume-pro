 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/landing/Hero";
import { ResumeBuilder } from "@/components/resume/ResumeBuilder";
 import { SavedResumes } from "@/components/resume/SavedResumes";
 import { useAuth } from "@/contexts/AuthContext";
 import { Resume } from "@/hooks/useResumes";
 import { Button } from "@/components/ui/button";
 import { Card } from "@/components/ui/card";
 import { ArrowLeft } from "lucide-react";

const Index = () => {
   const navigate = useNavigate();
   const { user, loading } = useAuth();
  const [showBuilder, setShowBuilder] = useState(false);
   const [showSavedResumes, setShowSavedResumes] = useState(false);
   const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
 
   const handleGetStarted = () => {
     if (user) {
       setShowSavedResumes(true);
     } else {
       navigate("/auth");
     }
   };
 
   const handleSelectResume = (resume: Resume) => {
     setSelectedResume(resume);
     setShowBuilder(true);
     setShowSavedResumes(false);
   };
 
   const handleCreateNew = () => {
     setSelectedResume(null);
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
   };

  if (showBuilder) {
     return <ResumeBuilder onBack={handleBack} initialResume={selectedResume} />;
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
 
   return <Hero onGetStarted={handleGetStarted} />;
};

export default Index;
