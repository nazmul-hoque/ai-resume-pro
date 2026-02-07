import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, CheckCircle2, Target, Zap, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tips = [
    {
        category: "ATS Optimization",
        icon: Target,
        title: "Beat the Bots",
        description: "Ensure your resume passes Applicant Tracking Systems with these key strategies.",
        points: [
            "Use standard section headers (Experience, Education, Skills).",
            "Avoid images, charts, and complex formatting within text areas.",
            "Incorporate keywords from the job description naturally.",
            "Use machine-readable font sizes (10-12pt for body text)."
        ]
    },
    {
        category: "Content Strategy",
        icon: CheckCircle2,
        title: "Impactful Writing",
        description: "Focus on results rather than just listed responsibilities.",
        points: [
            "Use the STAR method (Situation, Task, Action, Result).",
            "Quantify your achievements with numbers and percentages.",
            "Start every bullet point with a strong action verb.",
            "Keep your summary concise—about 3-4 impactful sentences."
        ]
    },
    {
        category: "AI Best Practices",
        icon: Zap,
        title: "AI Power Usage",
        description: "Get the most out of our AI-powered content suggestions.",
        points: [
            "Use our suggestions as a base, then add your personal touch.",
            "Tailor your resume for every single job application.",
            "Use the 'Fix It For Me' feature for granular improvements.",
            "Verify that AI-generated content accurately reflects your experience."
        ]
    },
    {
        category: "Final Polish",
        icon: Rocket,
        title: "The Extra Mile",
        description: "Small details that make a big difference to recruiters.",
        points: [
            "Proofread multiple times—AI can help, but human eyes are best.",
            "Ensure consistent formatting (dates, locations, bullet styles).",
            "Save your file as 'FirstName_LastName_Resume.pdf'.",
            "Limit your resume to 1-2 pages maximum."
        ]
    }
];

const Tips = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
                <div className="max-w-full px-4 lg:px-8 py-4 flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                    <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <h1 className="font-display font-bold text-xl">Resume Tips</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                <div className="space-y-12">
                    {/* Hero Section */}
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold font-display">Expert Advice for your Career</h2>
                        <p className="text-muted-foreground text-lg italic">
                            "A great resume doesn't just list what you did; it proves what you can do."
                        </p>
                    </div>

                    {/* Tips Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {tips.map((section, idx) => (
                            <Card key={idx} className="border-primary/10 hover:border-primary/30 transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <section.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-primary">{section.category}</span>
                                    </div>
                                    <CardTitle className="text-2xl">{section.title}</CardTitle>
                                    <CardDescription className="text-base">{section.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {section.points.map((point, pIdx) => (
                                            <li key={pIdx} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                                                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="bg-card border rounded-3xl p-12 text-center space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                        <h3 className="text-2xl font-bold font-display">Ready to build your best resume?</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Put these tips into practice with our AI-powered resume builder today.
                        </p>
                        <Button size="lg" className="rounded-full px-8" onClick={() => navigate("/")}>
                            Start Building Now
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Tips;
