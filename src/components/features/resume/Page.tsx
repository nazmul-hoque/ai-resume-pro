import React from "react";
import { cn } from "@/lib/utils";

interface PageProps {
    children: React.ReactNode;
    pageNumber?: number;
    className?: string;
}

export const Page = ({ children, pageNumber, className }: PageProps) => {
    return (
        <div
            className={cn(
                "relative bg-white shadow-xl mx-auto origin-top transition-all duration-300",
                "w-[210mm] h-auto print:m-0 print:shadow-none print:w-full",
                "border border-border/50 rounded-sm",
                className
            )}
        >
            {/* Content Area */}
            <div className="p-[15mm] sm:p-[20mm] print:p-0">
                <div className="w-full break-words">
                    {children}
                </div>
            </div>

            {/* Page Number Footer */}
            {pageNumber && (
                <div className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-[20mm] text-[9px] text-muted-foreground/40 font-semibold uppercase tracking-widest pointer-events-none print:hidden border-t border-muted-foreground/5 py-4">
                    <span className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                        CV Built with AI
                    </span>
                    <span>Page {pageNumber}</span>
                </div>
            )}

            {/* Decorative Edge */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-black/[0.02] to-transparent pointer-events-none print:hidden" />
        </div>
    );
};
