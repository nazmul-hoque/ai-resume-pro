import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ResumeData } from "@/types/resume";
import { resumeService, Resume } from "@/services/resume.service";

export type { Resume };

export const useResumes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["resumes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return resumeService.fetchResumes(user.id);
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
      return resumeService.fetchResumeById(id);
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
      return resumeService.createResume(user.id, title, template, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume created successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to create resume: " + error.message);
    },
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, template, data }: { id: string; title?: string; template?: string; data?: ResumeData }) => {
      return resumeService.updateResume(id, title, template, data);
    },
    onSuccess: (resume) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resume", resume.id] });
      toast.success("Resume saved");
    },
    onError: (error: any) => {
      toast.error("Failed to save resume: " + error.message);
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return resumeService.deleteResume(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume deleted");
    },
    onError: (error: any) => {
      toast.error("Failed to delete resume: " + error.message);
    },
  });
};

export const useDuplicateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return resumeService.duplicateResume(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume duplicated");
    },
    onError: (error: any) => {
      toast.error("Failed to duplicate resume: " + error.message);
    },
  });
};