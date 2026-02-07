import { supabase } from "@/integrations/supabase/client";

export type ActivityType =
    | 'resume_created'
    | 'resume_updated'
    | 'resume_imported'
    | 'pdf_exported'
    | 'docx_exported'
    | 'application_saved'
    | 'visibility_changed';

export interface UserActivity {
    id: string;
    user_id: string;
    type: ActivityType;
    description: string;
    metadata: any;
    created_at: string;
}

export const activityService = {
    async logActivity(type: ActivityType, description: string, metadata: any = {}) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;

        const { data, error } = await (supabase
            .from("user_activities" as any) as any)
            .insert({
                user_id: userData.user.id,
                type,
                description,
                metadata
            })
            .select()
            .single();

        if (error) {
            console.error("Error logging activity:", error);
            return null;
        }

        return data;
    },

    async getActivities(limit = 10): Promise<UserActivity[]> {
        const { data, error } = await (supabase
            .from("user_activities" as any) as any)
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Error fetching activities:", error);
            return [];
        }

        return data as UserActivity[];
    }
};
