import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface EditableFieldProps {
    name: string;
    value: string;
    type?: "text" | "textarea";
    className?: string;
    multiline?: boolean;
    onBeforeSave?: (value: string) => string;
    renderValue?: (value: string) => React.ReactNode;
    placeholder?: string;
    readOnly?: boolean;
}

export const EditableField = ({
    name,
    value,
    type = "text",
    className,
    multiline = false,
    onBeforeSave,
    renderValue,
    placeholder,
    readOnly = false,
}: EditableFieldProps) => {
    const formContext = useFormContext();
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            if (type === "textarea") {
                inputRef.current.style.height = "auto";
                inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
            }
        }
    }, [isEditing, type]);

    const handleBlur = () => {
        setIsEditing(false);
        let finalValue = localValue;
        if (onBeforeSave) {
            finalValue = onBeforeSave(localValue);
        }
        formContext?.setValue(name, finalValue, { shouldDirty: true });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !multiline && !e.shiftKey) {
            handleBlur();
        }
        if (e.key === "Escape") {
            setLocalValue(value);
            setIsEditing(false);
        }
    };

    if (isEditing && !readOnly) {
        if (type === "textarea") {
            return (
                <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={localValue}
                    onChange={(e) => {
                        setLocalValue(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={cn(
                        "w-full bg-white text-foreground border border-primary/30 p-1 rounded focus:outline-none focus:ring-1 focus:ring-primary/50 font-sans text-sm resize-none overflow-hidden",
                        className
                    )}
                />
            );
        }
        return (
            <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn(
                    "w-full bg-white text-foreground border border-primary/30 p-1 rounded focus:outline-none focus:ring-1 focus:ring-primary/50 font-sans text-sm",
                    className
                )}
            />
        );
    }

    return (
        <div
            onClick={() => !readOnly && setIsEditing(true)}
            className={cn(
                "rounded-sm transition-all min-h-[1.2em] relative group px-0.5",
                !readOnly && "cursor-pointer hover:bg-primary/5 hover:ring-1 hover:ring-primary/20",
                className
            )}
        >
            {renderValue ? renderValue(value) : (value || <span className="text-muted-foreground italic text-xs">{placeholder || "(Empty)"}</span>)}
            {!readOnly && (
                <div className="absolute -right-2 -top-4 hidden group-hover:flex items-center gap-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded shadow-lg z-50 animate-in fade-in zoom-in duration-200 pointer-events-none whitespace-nowrap">
                    Edit Inline
                </div>
            )}
        </div>
    );
};
