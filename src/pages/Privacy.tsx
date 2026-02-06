import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
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
                        <Shield className="w-5 h-5 text-primary" />
                        <h1 className="font-display font-bold text-xl">Privacy Policy</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                        <p className="text-muted-foreground">
                            At ResumeAI, we are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI-powered resume builder.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. Data We Collect</h2>
                        <p className="text-muted-foreground mb-4">
                            We collect information that you provide directly to us:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, and location provided during resume creation.</li>
                            <li><strong>Resume Content:</strong> Professional summaries, work experience, education, and skills.</li>
                            <li><strong>Account Data:</strong> If you create an account, we store your profile information and saved resumes.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. How We Use AI</h2>
                        <p className="text-muted-foreground">
                            We use Large Language Models (AI) to provide content suggestions, professional polishing, and ATS optimization. Your resume data is sent to our AI providers (like OpenAI or Anthropic) solely for processing and is not used to train their underlying models unless explicitly stated otherwise.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                        <p className="text-muted-foreground">
                            We implement industry-standard security measures to protect your data. Your information is stored securely in our database (Supabase), and we use encryption for data in transit and at rest.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                        <p className="text-muted-foreground">
                            Depending on your location, you may have the right to access, correct, or delete your personal data. You can manage your resumes and profile directly within the application or contact us for assistance.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have any questions about this Privacy Policy, please contact us at privacy@resumeai.pro.
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

export default Privacy;
