import { useState, useCallback } from "react";
import { aiService, SuggestionType, SuggestionContext } from "@/services/ai.service";
import { toast } from "sonner";

export const useAiSuggestion = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getSuggestion = useCallback(async (
    type: SuggestionType,
    context: SuggestionContext
  ): Promise<string | null> => {
    setIsLoading(true);

    try {
      const suggestion = await aiService.getSuggestion(type, context);
      return suggestion;
    } catch (err: any) {
      toast.error(err.message || "Failed to generate suggestion. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getSuggestion, isLoading };
};
