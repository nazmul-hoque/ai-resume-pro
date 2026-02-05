import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";

export type SuggestionType = "summary" | "experience" | "skills" | "match" | "parse" | "cover-letter" | "review" | "strategy";

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
}

export const aiService = {
    async _invoke<T = string>(
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
                throw error;
            }

            if (data?.error) {
                throw new Error(data.error);
            }

            if (shouldParse && data?.suggestion) {
                try {
                    return JSON.parse(data.suggestion) as T;
                } catch (parseErr) {
                    console.error(`Failed to parse AI ${type} response:`, parseErr);
                    throw new Error("Invalid response format from AI");
                }
            }

            return (data?.suggestion || null) as T | null;
        } catch (err) {
            console.error(`AI ${type} service error:`, err);
            throw err;
        }
    },

    async getSuggestion(
        type: SuggestionType,
        context: SuggestionContext
    ): Promise<string | null> {
        return this._invoke<string>(type, context);
    },

    async analyzeJobMatch(
        jobDescription: string,
        resumeData: ResumeData
    ): Promise<JobMatchAnalysis | null> {
        return this._invoke<JobMatchAnalysis>("match", { jobDescription, resumeData }, true);
    },

    async parseResume(rawText: string): Promise<ResumeData | null> {
        return this._invoke<ResumeData>("parse", { rawText }, true);
    },

    async generateCoverLetter(
        jobDescription: string,
        resumeData: ResumeData
    ): Promise<string | null> {
        return this._invoke<string>("cover-letter", { jobDescription, resumeData });
    },

    async recruiterReview(
        resumeData: ResumeData,
        jobDescription?: string
    ): Promise<any | null> {
        return this._invoke<any>("review", { resumeData, jobDescription }, true);
    },

    async getTemplateStrategy(
        resumeData: ResumeData,
        jobDescription?: string
    ): Promise<any | null> {
        return this._invoke<any>("strategy", { resumeData, jobDescription }, true);
    },
};
