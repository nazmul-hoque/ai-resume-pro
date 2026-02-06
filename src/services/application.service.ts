import { supabase } from "@/integrations/supabase/client";
import { JobApplication, CreateApplicationDTO } from "@/types/application";
import { toast } from "sonner";

export const applicationService = {
    async createApplication(application: CreateApplicationDTO): Promise<JobApplication | null> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
            toast.error("You must be logged in to track applications");
            return null;
        }

        const { data, error } = await (supabase
            .from("applications" as any) as any)
            .insert({
                ...application,
                user_id: userData.user.id,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating application:", error);
            toast.error("Failed to save application");
            return null;
        }

        toast.success("Application tracked successfully!");
        return data as unknown as JobApplication;
    },

    async getApplications(): Promise<JobApplication[]> {
        const { data, error } = await (supabase
            .from("applications" as any) as any)
            .select("*")
            .order("applied_at", { ascending: false });

        if (error) {
            console.error("Error fetching applications:", error);
            return [];
        }

        return data as unknown as JobApplication[];
    },

    async updateApplicationStatus(id: string, status: string): Promise<boolean> {
        const { error } = await (supabase
            .from("applications" as any) as any)
            .update({ status })
            .eq("id", id);

        if (error) {
            console.error("Error updating application status:", error);
            toast.error("Failed to update status");
            return false;
        }

        return true;
    },

    async deleteApplication(id: string): Promise<boolean> {
        const { error } = await (supabase
            .from("applications" as any) as any)
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting application:", error);
            toast.error("Failed to delete application");
            return false;
        }

        toast.success("Application removed");
        return true;
    }
};
