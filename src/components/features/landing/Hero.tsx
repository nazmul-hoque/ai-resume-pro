import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, FileText, CheckCircle, LogIn, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface HeroProps {
  onGetStarted: () => void;
  onViewTemplates: () => void;
  onViewApplications?: () => void;
}

export const Hero = ({ onGetStarted, onViewTemplates, onViewApplications }: HeroProps) => {
  const { user, signOut, loading } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Auth button */}
      <div className="absolute top-4 right-4 z-20">
        {!loading && (
          user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              Sign Out
            </Button>
          ) : (
            <Link to="/signin">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          )
        )}
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Resume Builder</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Build Your Perfect
            <span className="block mt-2 gradient-text">ATS-Friendly Resume</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Create professional resumes that pass applicant tracking systems with our intelligent builder.
            Get AI suggestions, real-time preview, and land your dream job.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl" onClick={onGetStarted}>
              {user ? "Manage My Resumes" : "Start Building Free"}
              <ArrowRight className="w-5 h-5" />
            </Button>
            {onViewApplications ? (
              <Button variant="heroOutline" size="xl" onClick={onViewApplications} className="gap-2">
                <Briefcase className="w-5 h-5" />
                Tracked Applications
              </Button>
            ) : (
              <Button variant="heroOutline" size="xl" onClick={onViewTemplates}>
                <FileText className="w-5 h-5" />
                View Templates
              </Button>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: CheckCircle, text: "ATS-Optimized Templates" },
              { icon: Sparkles, text: "AI Content Suggestions" },
              { icon: FileText, text: "Real-time Preview" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10"
              >
                <feature.icon className="w-5 h-5 text-accent" />
                <span className="text-primary-foreground/80 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
