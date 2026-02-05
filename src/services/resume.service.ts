import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";
import { Json } from "@/integrations/supabase/types";

export interface Resume {
    id: string;
    user_id: string;
    title: string;
    template: string;
    data: ResumeData;
    created_at: string;
    updated_at: string;
}

const parseResumeData = (row: any): Resume => ({
    ...row,
    data: row.data as unknown as ResumeData,
});

export const resumeService = {
    async fetchResumes(userId: string): Promise<Resume[]> {
        const { data, error } = await supabase
            .from("resumes")
            .select("*")
            .order("updated_at", { ascending: false });

        if (error) throw error;
        return data.map(parseResumeData);
    },

    async fetchResumeById(id: string): Promise<Resume | null> {
        const { data, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;
        return data ? parseResumeData(data) : null;
    },

    async createResume(userId: string, title: string, template: string, data: ResumeData): Promise<Resume> {
        const { data: resume, error } = await supabase
            .from("resumes")
            .insert([{
                user_id: userId,
                title,
                template,
                data: data as unknown as Json,
            }])
            .select()
            .single();

        if (error) throw error;
        return parseResumeData(resume);
    },

    async updateResume(id: string, title?: string, template?: string, data?: ResumeData): Promise<Resume> {
        const updates: Record<string, unknown> = {};
        if (title !== undefined) updates.title = title;
        if (template !== undefined) updates.template = template;
        if (data !== undefined) updates.data = data as unknown as Json;

        const { data: resume, error } = await supabase
            .from("resumes")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return parseResumeData(resume);
    },

    async deleteResume(id: string): Promise<void> {
        const { error } = await supabase
            .from("resumes")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    async duplicateResume(id: string): Promise<Resume> {
        const original = await this.fetchResumeById(id);
        if (!original) throw new Error("Resume not found");

        return this.createResume(
            original.user_id,
            `${original.title} (Copy)`,
            original.template,
            original.data
        );
    },
};
