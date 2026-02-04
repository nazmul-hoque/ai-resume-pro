import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SuggestionType = "summary" | "experience" | "skills";

interface SuggestionContext {
  jobTitle?: string;
  company?: string;
  currentText?: string;
  skills?: string[];
  yearsExperience?: number;
}

export const useAiSuggestion = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getSuggestion = useCallback(async (
    type: SuggestionType,
    context: SuggestionContext
  ): Promise<string | null> => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-suggest", {
        body: { type, context },
      });

      if (error) {
        console.error("AI suggestion error:", error);
        toast.error("Failed to generate suggestion. Please try again.");
        return null;
      }

      if (data?.error) {
        toast.error(data.error);
        return null;
      }

      return data?.suggestion || null;
    } catch (err) {
      console.error("AI suggestion error:", err);
      toast.error("Failed to generate suggestion. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getSuggestion, isLoading };
};
