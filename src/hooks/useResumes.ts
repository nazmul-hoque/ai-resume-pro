 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { ResumeData } from "@/types/resume";
 import { useAuth } from "@/contexts/AuthContext";
 import { toast } from "sonner";
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
 
 const parseResumeData = (row: {
   id: string;
   user_id: string;
   title: string;
   template: string;
   data: Json;
   created_at: string;
   updated_at: string;
 }): Resume => ({
   ...row,
   data: row.data as unknown as ResumeData,
 });
 
 export const useResumes = () => {
   const { user } = useAuth();
 
   return useQuery({
     queryKey: ["resumes", user?.id],
     queryFn: async () => {
       if (!user) return [];
       
       const { data, error } = await supabase
         .from("resumes")
         .select("*")
         .order("updated_at", { ascending: false });
 
       if (error) throw error;
       return data.map(parseResumeData);
     },
     enabled: !!user,
   });
 };
 
 export const useResume = (id: string | null) => {
   const { user } = useAuth();
 
   return useQuery({
     queryKey: ["resume", id],
     queryFn: async () => {
       if (!user || !id) return null;
       
       const { data, error } = await supabase
         .from("resumes")
         .select("*")
         .eq("id", id)
         .maybeSingle();
 
       if (error) throw error;
       return data ? parseResumeData(data) : null;
     },
     enabled: !!user && !!id,
   });
 };
 
 export const useCreateResume = () => {
   const queryClient = useQueryClient();
   const { user } = useAuth();
 
   return useMutation({
     mutationFn: async ({ title, template, data }: { title: string; template: string; data: ResumeData }) => {
       if (!user) throw new Error("Not authenticated");
 
       const { data: resume, error } = await supabase
         .from("resumes")
         .insert([{
           user_id: user.id,
           title,
           template,
           data: data as unknown as Json,
         }])
         .select()
         .single();
 
       if (error) throw error;
       return parseResumeData(resume);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["resumes"] });
       toast.success("Resume created successfully");
     },
     onError: (error) => {
       toast.error("Failed to create resume: " + error.message);
     },
   });
 };
 
 export const useUpdateResume = () => {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, title, template, data }: { id: string; title?: string; template?: string; data?: ResumeData }) => {
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
     onSuccess: (resume) => {
       queryClient.invalidateQueries({ queryKey: ["resumes"] });
       queryClient.invalidateQueries({ queryKey: ["resume", resume.id] });
       toast.success("Resume saved");
     },
     onError: (error) => {
       toast.error("Failed to save resume: " + error.message);
     },
   });
 };
 
 export const useDeleteResume = () => {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase
         .from("resumes")
         .delete()
         .eq("id", id);
 
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["resumes"] });
       toast.success("Resume deleted");
     },
     onError: (error) => {
       toast.error("Failed to delete resume: " + error.message);
     },
   });
 };