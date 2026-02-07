import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
    // Normalize content: ensure bullet points from editor use standard markdown '-'
    const normalizedContent = content
        ?.replace(/^[•]\s/gm, '- ')
        ?.replace(/([^\n])\n[•]\s/g, '$1\n\n- ');

    return (
        <div className={cn("prose prose-sm max-w-none w-full break-words overflow-hidden dark:prose-invert prose-p:leading-relaxed prose-headings:mb-2 prose-p:mb-1", className)}>
            <ReactMarkdown
                remarkPlugins={[]} // Add plugins here if needed
                components={{
                    p: ({ children }) => <p className="mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-0">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-0">{children}</ol>,
                    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                }}
            >
                {normalizedContent}
            </ReactMarkdown>
        </div>
    );
};
