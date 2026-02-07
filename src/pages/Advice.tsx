import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, Users, MessageCircle, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const adviceSections = [
    {
        title: "Mastering the Interview",
        icon: MessageCircle,
        content: "Preparation is 90% of interview success. Research the company's recent news, understand their culture, and prepare 3-4 specific stories that demonstrate your impact using the STAR method (Situation, Task, Action, Result).",
        tips: ["Research the interviewers on LinkedIn", "Prepare thoughtful questions for them", "Practice your 'elevator pitch'"]
    },
    {
        title: "Personal Branding",
        icon: Award,
        content: "Your resume is just one part of your brand. Optimize your LinkedIn profile with a professional photo, a value-driven headline, and a summary that tells your story beyond just job titles.",
        tips: ["Get a professional headshot", "Engage with industry content", "Keep your portfolio updated"]
    },
    {
        title: "Modern Networking",
        icon: Users,
        content: "80% of jobs are filled through networking. Don't just ask for a job; ask for 'informational interviews'. Build genuine relationships by offering value or sharing relevant industry insights.",
        tips: ["Attend virtual industry events", "Reach out to alumni", "Offer to help others first"]
    },
    {
        title: "Salary Negotiation",
        icon: TrendingUp,
        content: "Never accept the first offer immediately. Research market rates using sites like Glassdoor or Payscale. Focus on the total compensation package including benefits, stock options, and professional development budgets.",
        tips: ["Know your 'walk-away' number", "Focus on the value you bring", "Get everything in writing"]
    }
];

const Advice = () => {
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
                        <Briefcase className="w-5 h-5 text-primary" />
                        <h1 className="font-display font-bold text-xl">Career Advice</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                <div className="space-y-16">
                    {/* Hero Section */}
                    <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-primary">
                            Elevate Your Professional Journey
                        </h2>
                        <p className="text-muted-foreground text-xl leading-relaxed">
                            Beyond the resume, we're here to help you navigate the complexities of the modern job market.
                        </p>
                    </div>

                    {/* Advice Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {adviceSections.map((section, idx) => (
                            <Card key={idx} className="group overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                            <section.icon className="w-6 h-6" />
                                        </div>
                                        <CardTitle className="text-2xl font-display">{section.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {section.content}
                                    </p>
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-primary/70">Pro Tips</h4>
                                        <ul className="grid grid-cols-1 gap-2">
                                            {section.tips.map((tip, tIdx) => (
                                                <li key={tIdx} className="flex items-center gap-2 text-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Bottom Banner */}
                    <div className="relative rounded-[2rem] overflow-hidden bg-primary text-primary-foreground p-12 md:p-20 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-50" />
                        <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                            <h3 className="text-3xl md:text-5xl font-bold font-display">Your Dream Career Awaits</h3>
                            <p className="text-primary-foreground/80 text-lg">
                                Combine expert advice with our AI-powered tools to land your next high-impact role faster than ever.
                            </p>
                            <Button size="xl" variant="hero" onClick={() => navigate("/")} className="rounded-full shadow-2xl hover:scale-105 transition-transform">
                                Get Started for Free
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Advice;
