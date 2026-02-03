import { useState } from "react";
import { Hero } from "@/components/landing/Hero";
import { ResumeBuilder } from "@/components/resume/ResumeBuilder";

const Index = () => {
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <ResumeBuilder onBack={() => setShowBuilder(false)} />;
  }

  return <Hero onGetStarted={() => setShowBuilder(true)} />;
};

export default Index;
