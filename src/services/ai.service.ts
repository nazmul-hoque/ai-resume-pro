import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";
import { FunctionsHttpError } from "@supabase/supabase-js";

export type SuggestionType = "summary" | "experience" | "skills" | "match" | "parse" | "cover-letter" | "review" | "strategy" | "improve_content";

export interface JobMatchAnalysis {
    matchScore: number;
    matchingKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
}

export interface SuggestionContext {
    jobTitle?: string;
    company?: string;
    currentText?: string;
    skills?: string[];
    yearsExperience?: number;
    jobDescription?: string;
    resumeData?: ResumeData;
    rawText?: string;
    sectionType?: string;
}

async function invokeAI<T = string>(
    type: SuggestionType,
    context: SuggestionContext,
    shouldParse: boolean = false
): Promise<T | null> {
    try {
        const { data, error } = await supabase.functions.invoke("ai-suggest", {
            body: { type, context },
        });

        if (error) {
            console.error(`AI ${type} error:`, error);
            if (error instanceof FunctionsHttpError) {
                const errorMessage = await error.context.json();
                console.log("Function returned an error", errorMessage);
                throw new Error(errorMessage.error || "AI service failed");
            }
            throw error;
        }

        if (data?.error) {
            throw new Error(data.error);
        }

        if (shouldParse && data?.suggestion) {
            try {
                // Find the first '{' and the last '}' to extract JSON from potentially messy AI output
                const jsonMatch = data.suggestion.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    console.error(`No JSON object found in AI ${type} response. Raw:`, data.suggestion);
                    throw new Error("No JSON found in AI response");
                }
                return JSON.parse(jsonMatch[0]) as T;
            } catch (parseErr) {
                console.error(`Failed to parse AI ${type} response. Raw:`, data.suggestion);
                console.error(`Parse error:`, parseErr);
                throw new Error("Invalid response format from AI");
            }
        }

        return (data?.suggestion || null) as T | null;
    } catch (err) {
        console.error(`AI ${type} service error:`, err);
        throw err;
    }
}

export const aiService = {
    async getSuggestion(
        type: SuggestionType,
        context: SuggestionContext
    ): Promise<string | null> {
        return invokeAI<string>(type, context);
    },

    async analyzeJobMatch(
        jobDescription: string,
        resumeData: ResumeData
    ): Promise<JobMatchAnalysis | null> {
        return invokeAI<JobMatchAnalysis>("match", { jobDescription, resumeData }, true);
    },

    async parseResume(rawText: string): Promise<ResumeData | null> {
        return invokeAI<ResumeData>("parse", { rawText }, true);
    },

    async generateCoverLetter(
        jobDescription: string,
        resumeData: ResumeData
    ): Promise<string | null> {
        return invokeAI<string>("cover-letter", { jobDescription, resumeData });
    },

    async recruiterReview(
        resumeData: ResumeData,
        jobDescription?: string
    ): Promise<any | null> {
        return invokeAI<any>("review", { resumeData, jobDescription }, true);
    },

    async getTemplateStrategy(
        resumeData: ResumeData,
        jobDescription?: string
    ): Promise<any | null> {
        return invokeAI<any>("strategy", { resumeData, jobDescription }, true);
    },

    async improveSection(
        currentText: string,
        sectionType: string
    ): Promise<{ improvedText: string } | null> {
        const suggestion = await invokeAI<string>("improve_content", { currentText, sectionType }, false);
        return suggestion ? { improvedText: suggestion } : null;
    },
};
