import { useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseAutoSaveOptions {
  onSave: () => Promise<void>;
  delay?: number;
  enabled?: boolean;
  hasChanges: boolean;
}

export const useAutoSave = ({
  onSave,
  delay = 30000,
  enabled = true,
  hasChanges,
}: UseAutoSaveOptions) => {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveAttemptRef = useRef<number>(0);

  const performSave = useCallback(async () => {
    if (!hasChanges) return;
    
    const now = Date.now();
    // Debounce: don't save more than once every 5 seconds
    if (now - lastSaveAttemptRef.current < 5000) return;
    
    lastSaveAttemptRef.current = now;
    
    try {
      await onSave();
      toast({
        title: "Auto-saved",
        description: "Your changes have been saved automatically",
        duration: 2000,
      });
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, [onSave, hasChanges, toast]);

  useEffect(() => {
    if (!enabled || !hasChanges) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(performSave, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, hasChanges, delay, performSave]);

  return { triggerSave: performSave };
};
