import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, Search, Mail, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const faqs = [
    {
        question: "How do AI suggestions work?",
        answer: "Our AI analyzes your job title and existing resume content to suggest industry-standard bullets, summaries, and skills. We use advanced language models to ensure your content is professional and impactful."
    },
    {
        question: "Is my resume ATS-compatible?",
        answer: "Yes! All our templates are designed with Applicant Tracking Systems (ATS) in mind. We use clean layouts, standard headings, and machine-readable font sizes to ensure your resume parses correctly."
    },
    {
        question: "How do I use the Application Tracker?",
        answer: "When you generate a cover letter for a specific job, you'll see a 'Save to Tracker' button. This captures a snapshot of the resume you used and the job details, allowing you to manage your job search in one place."
    },
    {
        question: "Can I export to PDF?",
        answer: "Absolutely. Once you're happy with your resume, click the 'Download PDF' button in the builder. Your resume will be generated with professional formatting, ready to send to recruiters."
    },
    {
        question: "Is my data secure?",
        answer: "We take security seriously. Your data is encrypted and stored securely. We do not use your personal resume content to train public AI models."
    },
    {
        question: "What if I need more help?",
        answer: "You can reach out to our support team at support@resumeai.pro. We typically respond within 24 hours."
    }
];

const Help = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
                <div className="max-w-full px-4 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-primary" />
                            <h1 className="font-display font-bold text-xl">Help Center</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Hero Section */}
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold font-display">How can we help you?</h2>
                        <p className="text-muted-foreground text-lg">
                            Search our FAQs or browse the topics below to find answers.
                        </p>
                        <div className="relative max-w-lg mx-auto mt-8">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search for help..."
                                className="pl-10 h-12 rounded-full border-primary/20 focus:border-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* FAQs */}
                    <section className="space-y-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Frequently Asked Questions
                        </h3>
                        {filteredFaqs.length > 0 ? (
                            <Accordion type="single" collapsible className="w-full">
                                {filteredFaqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground italic">
                                No results found for "{searchQuery}". Try a different keyword!
                            </div>
                        )}
                    </section>

                    {/* Contact Support */}
                    <section className="bg-primary/5 rounded-2xl p-8 border border-primary/10 text-center space-y-4">
                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Still have questions?</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Can't find what you're looking for? Our support team is here to help you land that dream job.
                        </p>
                        <Button className="rounded-full px-8" asChild>
                            <a href="mailto:support@resumeai.pro">Contact Support</a>
                        </Button>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Help;
