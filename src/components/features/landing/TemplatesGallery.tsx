import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { templates, TemplateId } from "../resume/templates";
import { Layout, FileText, Sparkles, CheckCircle } from "lucide-react";

const templateIcons = {
    modern: Layout,
    classic: FileText,
    creative: Sparkles,
};

const templatePreviews = {
    modern: "/images/template-modern.png",
    classic: "/images/template-classic.png",
    creative: "/images/template-creative.png",
};

interface TemplatesGalleryProps {
    onSelectTemplate: (templateId: TemplateId) => void;
}

export const TemplatesGallery = ({ onSelectTemplate }: TemplatesGalleryProps) => {
    return (
        <section id="templates-gallery" className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                        Choose Your <span className="gradient-text">Winning Template</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Our templates are meticulously designed to be ATS-friendly while maintaining a professional and modern look.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {templates.map((template) => {
                        const Icon = templateIcons[template.id] || Layout;
                        const previewUrl = templatePreviews[template.id];

                        return (
                            <Card
                                key={template.id}
                                className="group h-full flex flex-col overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 card-shadow hover:card-shadow-hover"
                            >
                                {/* Visual Preview */}
                                <div className="relative h-64 overflow-hidden bg-muted">
                                    <img
                                        src={previewUrl}
                                        alt={`${template.name} Template Preview`}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 text-accent" />
                                            Intuitive Design
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold">{template.name}</h3>
                                    </div>

                                    <p className="text-muted-foreground mb-6 leading-relaxed flex-1">
                                        {template.description}
                                    </p>

                                    <ul className="space-y-3 mb-8">
                                        {["ATS-Optimized", "Professional Typography", "Customizable Sections"].map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircle className="w-4 h-4 text-accent" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        variant="outline"
                                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-auto"
                                        onClick={() => onSelectTemplate(template.id)}
                                    >
                                        Choose Template
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
