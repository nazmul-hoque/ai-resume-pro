import { Sparkles, Target, FileCheck, Zap, Brain, FileText } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Writing",
    description: "Get intelligent suggestions for your summary, bullet points, and skills tailored to your target role.",
    highlight: true,
  },
  {
    icon: Target,
    title: "Job Targeting",
    description: "Paste a job description and let AI optimize your resume to match key requirements and keywords.",
  },
  {
    icon: FileCheck,
    title: "ATS Health Check",
    description: "Real-time analysis ensures your resume passes applicant tracking systems with a high compatibility score.",
  },
  {
    icon: Sparkles,
    title: "Smart Bullet Points",
    description: "Transform basic job duties into compelling, action-driven achievements that stand out.",
  },
  {
    icon: Zap,
    title: "Instant Enhancement",
    description: "One-click improvements to refine tone, add impact metrics, and strengthen your professional narrative.",
  },
  {
    icon: FileText,
    title: "Cover Letter Generator",
    description: "Generate tailored cover letters that complement your resume and speak directly to hiring managers.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by AI</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Build Smarter with <span className="gradient-text">AI Assistance</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our intelligent tools help you craft the perfect resume by analyzing job requirements, 
            optimizing content, and ensuring ATS compatibility—all in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                feature.highlight 
                  ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40" 
                  : "bg-card border-border hover:border-primary/30 hover:shadow-lg"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                feature.highlight 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
              }`}>
                <feature.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              
              {feature.highlight && (
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  Most Popular
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
