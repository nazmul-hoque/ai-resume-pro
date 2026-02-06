import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                    <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-primary" />
                        <h1 className="font-display font-bold text-xl">Terms of Service</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">
                            By accessing or using ResumeAI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                        <p className="text-muted-foreground">
                            ResumeAI is an AI-powered resume building platform that provides templates, content suggestions, and optimization tools to help users create professional resumes and cover letters.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
                        <p className="text-muted-foreground mb-4">
                            When using our service, you agree to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Provide accurate and truthful information in your resume.</li>
                            <li>Not use the service for any illegal or unauthorized purpose.</li>
                            <li>Maintain the security of your account credentials.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. AI Content Ownership</h2>
                        <p className="text-muted-foreground">
                            You own the content you provide to the service. While ResumeAI provides AI-generated suggestions, the final output and accuracy of your resume are your responsibility. We do not claim ownership over the resumes you generate using our tool.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
                        <p className="text-muted-foreground">
                            ResumeAI is provided "as is" without warranties of any kind. We do not guarantee that using our service will result in a job offer or specific career outcome. We are not liable for any direct, indirect, or incidental damages arising from your use of the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
                        <p className="text-muted-foreground">
                            We reserve the right to modify these terms at any time. We will notify users of any significant changes. Your continued use of the service after such changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <footer className="text-sm text-muted-foreground mt-12 border-t pt-4">
                        Last updated: February 6, 2026
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default Terms;
