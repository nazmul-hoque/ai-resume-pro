import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface AiEnhanceButtonProps {
    onClick: () => Promise<void> | void;
    isLoading: boolean;
    label?: string;
    className?: string;
    variant?: "outline" | "ghost" | "secondary" | "default";
    size?: "default" | "sm" | "lg" | "icon";
    disabled?: boolean;
}

export const AiEnhanceButton = ({
    onClick,
    isLoading,
    label = "AI Enhance",
    className = "",
    variant = "outline",
    size = "sm",
    disabled = false,
}: AiEnhanceButtonProps) => {
    return (
        <Button
            variant={variant}
            size={size}
            className={`gap-2 ${className}`}
            onClick={onClick}
            disabled={isLoading || disabled}
            type="button"
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Sparkles className="w-4 h-4 text-primary" />
            )}
            {isLoading ? "Generating..." : label}
        </Button>
    );
};
