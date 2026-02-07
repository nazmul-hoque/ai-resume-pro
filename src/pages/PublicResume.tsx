import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { resumeService, Resume } from "@/services/resume.service";
import { ModernTemplate, ClassicTemplate, CreativeTemplate } from "@/components/features/resume/templates";
import { Page } from "@/components/features/resume/Page";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Loader2, Lock } from "lucide-react";
import { Helmet } from "react-helmet-async";

const PublicResume = () => {
    const { id } = useParams<{ id: string }>();
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadResume = async () => {
            if (!id) return;
            try {
                const data = await resumeService.fetchResumeById(id);
                if (!data) {
                    setError("Resume not found");
                } else if (!data.is_public) {
                    setError("This resume is private");
                } else {
                    setResume(data);
                }
            } catch (err) {
                console.error("Error loading public resume:", err);
                setError("Failed to load resume");
            } finally {
                setLoading(false);
            }
        };

        loadResume();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading resume...</p>
            </div>
        );
    }

    if (error || !resume) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-destructive/10 p-4 rounded-full mb-6">
                    {error === "This resume is private" ? (
                        <Lock className="h-10 w-10 text-destructive" />
                    ) : (
                        <FileText className="h-10 w-10 text-destructive" />
                    )}
                </div>
                <h1 className="text-2xl font-bold mb-2">{error || "Resume Not Found"}</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    {error === "This resume is private"
                        ? "The owner has set this resume to private. Please contact them for a shared link."
                        : "The resume you're looking for doesn't exist or may have been deleted."}
                </p>
                <Button asChild>
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go to Homepage
                    </Link>
                </Button>
            </div>
        );
    }

    const renderTemplate = () => {
        const props = { data: resume.data, readOnly: true };
        switch (resume.template) {
            case "classic":
                return <ClassicTemplate {...props} />;
            case "creative":
                return <CreativeTemplate {...props} />;
            case "modern":
            default:
                return <ModernTemplate {...props} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>{resume.title} | Shared Resume</title>
                <meta name="description" content={`Shared resume of ${resume.data.personalInfo.fullName}`} />
            </Helmet>

            <div className="w-full max-w-[210mm] mx-auto flex flex-col gap-8">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold">{resume.title}</h2>
                            <p className="text-xs text-muted-foreground">Shared View</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/">
                            Create Your Own
                        </Link>
                    </Button>
                </div>

                <div className="flex justify-center w-full">
                    <Page className="shadow-2xl">
                        {renderTemplate()}
                    </Page>
                </div>

                <footer className="text-center text-muted-foreground text-sm pt-8">
                    <p>© {new Date().getFullYear()} ResumeMatch Pro. High-fidelity shared resume.</p>
                </footer>
            </div>
        </div>
    );
};

export default PublicResume;
